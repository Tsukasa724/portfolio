import { jwtDecode } from "jwt-decode";

// JWT のペイロード型（必要に応じて拡張してください）
type JWTPayload = {
    sub?: string;
    email?: string;
    role?: string;
    exp?: number;
};

export class UserAuth {
    /**
     * JWT からペイロードを取得
     */
    static getPayload(): JWTPayload | null {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        try {
            const payload: JWTPayload = jwtDecode(token);
            return payload;
        } catch (error) {
            console.error("JWTのデコードに失敗しました:", error);
            return null;
        }
    }

    /**
     * メールアドレスを取得
     */
    static getUserEmail(): string | null {
        const payload = this.getPayload();
        return payload?.email || null;
    }

    /**
     * ロール（role）を取得
     */
    static getUserRole(): string | null {
        const payload = this.getPayload();
        return payload?.role || null;
    }

    /**
     * トークンが有効かどうか（期限切れチェック）
     */
    static isTokenValid(): boolean {
        const payload = this.getPayload();
        if (!payload || !payload.exp) return false;

        const now = Math.floor(Date.now() / 1000); // 現在時刻（秒）
        return payload.exp > now;
    }
}
