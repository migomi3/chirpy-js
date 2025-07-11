import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT, extractBearerToken, extractAPIKey } from "./auth";
import { BadRequestError, UserNotAuthenticatedError } from "../api/errors.js";
describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1;
    let hash2;
    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });
    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });
    it("should return false for an incorrect password", async () => {
        const result = await checkPasswordHash("wrongPassword", hash1);
        expect(result).toBe(false);
    });
    it("should return false when password doesn't match a different hash", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false);
    });
    it("should return false for an empty password", async () => {
        const result = await checkPasswordHash("", hash1);
        expect(result).toBe(false);
    });
    it("should return false for an invalid hash", async () => {
        const result = await checkPasswordHash(password1, "invalidhash");
        expect(result).toBe(false);
    });
});
describe("JWT Functions", () => {
    const secret = "secret";
    const wrongSecret = "wrong_secret";
    const userID = "some-unique-user-id";
    let validToken;
    beforeAll(() => {
        validToken = makeJWT(userID, 3600, secret);
    });
    it("should validate a valid token", () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userID);
    });
    it("should throw an error for an invalid token string", () => {
        expect(() => validateJWT("invalid.token.string", secret)).toThrow(UserNotAuthenticatedError);
    });
    it("should throw an error when the token is signed with a wrong secret", () => {
        expect(() => validateJWT(validToken, wrongSecret)).toThrow(UserNotAuthenticatedError);
    });
});
describe("extractBearerToken", () => {
    it("should extract the token from a valid header", () => {
        const token = "mySecretToken";
        const header = `Bearer ${token}`;
        expect(extractBearerToken(header)).toBe(token);
    });
    it("should extract the token even if there are extra parts", () => {
        const token = "mySecretToken";
        const header = `Bearer ${token} extra-data`;
        expect(extractBearerToken(header)).toBe(token);
    });
    it("should throw a BadRequestError if the header does not contain at least two parts", () => {
        const header = "Bearer";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });
    it('should throw a BadRequestError if the header does not start with "Bearer"', () => {
        const header = "Basic mySecretToken";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });
    it("should throw a BadRequestError if the header is an empty string", () => {
        const header = "";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });
});
describe("extractAPIKey", () => {
    it("should extract the key from a valid header", () => {
        const key = "mySecretkey";
        const header = `ApiKey ${key}`;
        expect(extractAPIKey(header)).toBe(key);
    });
    it("should extract the key even if there are extra parts", () => {
        const key = "mySecretkey";
        const header = `ApiKey ${key} extra-data`;
        expect(extractAPIKey(header)).toBe(key);
    });
    it("should throw a BadRequestError if the header does not contain at least two parts", () => {
        const header = "ApiKey";
        expect(() => extractAPIKey(header)).toThrow(BadRequestError);
    });
    it('should throw a BadRequestError if the header does not start with "ApiKey"', () => {
        const header = "Basic mySecretkey";
        expect(() => extractAPIKey(header)).toThrow(BadRequestError);
    });
    it("should throw a BadRequestError if the header is an empty string", () => {
        const header = "";
        expect(() => extractAPIKey(header)).toThrow(BadRequestError);
    });
});
