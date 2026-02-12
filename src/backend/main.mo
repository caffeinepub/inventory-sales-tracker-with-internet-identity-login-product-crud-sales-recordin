import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type UserProfile = {
    displayName : Text;
    defaultLowStockThreshold : Nat;
  };

  type Product = {
    id : Text;
    name : Text;
    costPrice : Nat; // cents
    salePrice : Nat; // cents
    stockQuantity : Nat;
    lowStockThreshold : ?Nat;
  };

  type SaleRecord = {
    id : Text;
    productId : Text;
    quantity : Nat;
    salePrice : Nat; // cents
    costPrice : Nat; // cents
    profit : Nat; // cents
    timestamp : Time.Time;
    notes : ?Text;
  };

  // Initialize the authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Text, Product>();
  let sales = Map.empty<Text, SaleRecord>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create products");
    };
    switch (products.get(product.id)) {
      case (null) {
        products.add(product.id, product);
      };
      case (?_) {
        Runtime.trap("Product with this ID already exists");
      };
    };
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update products");
    };
    switch (products.get(product.id)) {
      case (null) {
        Runtime.trap("Product does not exist");
      };
      case (?_) {
        products.add(product.id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete products");
    };
    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product does not exist");
      };
      case (?_) {
        products.remove(productId);
      };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(productId : Text) : async ?Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    products.get(productId);
  };

  // Sales Management
  public shared ({ caller }) func recordSale(sale : SaleRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record sales");
    };

    switch (products.get(sale.productId)) {
      case (null) {
        Runtime.trap("Product does not exist");
      };
      case (?product) {
        if (product.stockQuantity >= sale.quantity) {
          let updatedProduct : Product = {
            id = product.id;
            name = product.name;
            costPrice = product.costPrice;
            salePrice = product.salePrice;
            stockQuantity = product.stockQuantity - sale.quantity;
            lowStockThreshold = product.lowStockThreshold;
          };
          products.add(product.id, updatedProduct);
          sales.add(sale.id, sale);
        } else {
          Runtime.trap("Not enough stock to record sale");
        };
      };
    };
  };

  public query ({ caller }) func getAllSales() : async [SaleRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sales");
    };
    sales.values().toArray();
  };

  public query ({ caller }) func getSalesByDateRange(startTime : Time.Time, endTime : Time.Time) : async [SaleRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sales");
    };
    sales.values().toArray().filter(
      func(sale) {
        sale.timestamp >= startTime and sale.timestamp <= endTime;
      }
    );
  };

  // Dashboard and Alerts
  public query ({ caller }) func getLowStockAlerts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view low stock alerts");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?profile) {
        profile;
      };
    };

    products.values().toArray().filter(
      func(product) {
        let threshold = switch (product.lowStockThreshold) {
          case (null) { userProfile.defaultLowStockThreshold };
          case (?override) { override };
        };
        product.stockQuantity <= threshold;
      }
    );
  };
};
