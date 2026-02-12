import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    stockQuantity: bigint;
    lowStockThreshold?: bigint;
    name: string;
    salePrice: bigint;
    costPrice: bigint;
}
export type Time = bigint;
export interface UserProfile {
    displayName: string;
    defaultLowStockThreshold: bigint;
}
export interface SaleRecord {
    id: string;
    productId: string;
    notes?: string;
    timestamp: Time;
    quantity: bigint;
    profit: bigint;
    salePrice: bigint;
    costPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllSales(): Promise<Array<SaleRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLowStockAlerts(): Promise<Array<Product>>;
    getProduct(productId: string): Promise<Product | null>;
    getSalesByDateRange(startTime: Time, endTime: Time): Promise<Array<SaleRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordSale(sale: SaleRecord): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
