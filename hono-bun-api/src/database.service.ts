import { Database } from "bun:sqlite";
import { faker } from '@faker-js/faker';
import * as uuid from 'uuid';

export interface TUser {
    id: string;
    name: string;
    email: string;
    age: number;
    avatar: string;
    created_at?: string;
}

export class User {
    private db: Database;
    
    constructor(dbPath: string = "mydb.sqlite") {
        this.db = new Database(dbPath, { create: true });
        this.initializeTable();
    }
    
    private initializeTable(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id string PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                age INTEGER,
                avatar TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
    
    insertUser(user: Omit<TUser, 'created_at'>): string {
        const stmt = this.db.prepare(`
            INSERT INTO users (id, name, email, age, avatar)
            VALUES ($id, $name, $email, $age, $avatar);
        `);
        
        const result = stmt.run({
            $id: user.id,
            $name: user.name,
            $email: user.email,
            $age: user.age,
            $avatar: user.avatar
        });
        
        console.log(`Inserted: ${user.name} (${user.email})`);
        return String(result.lastInsertRowid);
    }
    
    getAllUsers(): TUser[] {
        const stmt = this.db.query("SELECT * FROM users;");
        return stmt.all() as TUser[];
    }
    
    getUserById(id: string): TUser | null {
        const stmt = this.db.prepare("SELECT * FROM users WHERE id = $id;");
        return stmt.get({ $id: id }) as TUser || null;
    }
    
    updateUser(id: string, userData: Partial<TUser>): boolean {
        const user = this.getUserById(id);
        if (!user) return false;
        
        const updatedUser = { ...user, ...userData };
        
        const stmt = this.db.prepare(`
            UPDATE users
            SET name = $name, email = $email, age = $age, avatar = $avatar
            WHERE id = $id;
        `);
        
        const result = stmt.run({
            $id: id,
            $name: updatedUser.name,
            $email: updatedUser.email,
            $age: updatedUser.age,
            $avatar: updatedUser.avatar
        });
        
        return result.changes > 0;
    }
    
    deleteUser(id: string): boolean {
        const stmt = this.db.prepare("DELETE FROM users WHERE id = $id;");
        const result = stmt.run({ $id: id });
        return result.changes > 0;
    }
    
    clearUsers(): void {
        this.db.run("DELETE FROM users;");
    }
    
    generateFakeUsers(count: number): void {
        console.log(`Inserting ${count} fake users...`);
        for (let i = 0; i < count; i++) {
            this.insertUser({
                id: uuid.v4(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                age: faker.number.int({ min: 18, max: 80 }),
                avatar: faker.image.avatar()
            });
        }
    }
    
    printAllUsers(): void {
        const users = this.getAllUsers();
        console.log("\nAll users:", users);
    }
}
