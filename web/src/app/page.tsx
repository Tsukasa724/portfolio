"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";

// APIエンドポイントのURLを設定
const API_URL = "http://localhost:8080/signin/";

// バリデーションルール
const rules = {
    required: (value: string) => !!value || "必須項目です",
};

// 複数バリデーションルールに対応
const runValidationAll = (value: string, ruleList: ((v: string) => true | string)[]): string[] => {
    return ruleList.map((rule) => rule(value)).filter((res): res is string => res !== true);
};

export default function Home() {
    // リダイレクト管理
    const router = useRouter();

    // State状態管理
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});

    // 入力値に対してルールを実行し、エラーを保存
    const validateEmail = (value: string) => {
        const emailErrors = runValidationAll(value, [rules.required]);
        setErrors((prev) => ({ ...prev, email: emailErrors }));
    };
    const validatePassword = (value: string) => {
        const passwordErrors = runValidationAll(value, [rules.required]);
        setErrors((prev) => ({ ...prev, password: passwordErrors }));
    };

    // 入力フォームを送信したときの動作を定義
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailErrors = runValidationAll(email, [rules.required]);
        const passwordErrors = runValidationAll(password, [rules.required]);
        setErrors({ email: emailErrors, password: passwordErrors });

        if (emailErrors.length === 0 && passwordErrors.length === 0) {
            try {
                const body = new URLSearchParams();
                body.append("username", email);
                body.append("password", password);

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: body.toString(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`エラーメッセージ: ${JSON.stringify(errorData.message)}`);
                    return;
                }

                const data = await response.json();
                console.log("トークン:", data);

                // アクセストークンは localStorage に保存（または Cookie）
                localStorage.setItem("access_token", data.access_token);

                // 遷移先にリダイレクト
                router.push("/dashboard");
            } catch (error) {
                console.error("APIリクエスト失敗:", error);
                alert("サーバーに接続できませんでした。");
            }
        }
    };

    return (
        <Stack height="100vh" justifyContent="center" alignItems="center" gap="32px">
            <Typography id="login_heading" variant="h1" fontSize="1.5rem" className="login-title">
                ログイン
            </Typography>
            <Stack component="form" width={560} gap="24px" aria-labelledby="login_heading" className="login-form" onSubmit={handleSubmit}>
                <TextField label="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => validateEmail(email)} error={!!errors.email?.length} helperText={errors.email?.[0]} className="login-input" />
                <TextField label="パスワード" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => validatePassword(password)} error={!!errors.password?.length} helperText={errors.password?.[0]} className="login-input" />
                <Button type="submit" variant="contained" className="login-button">
                    ログイン
                </Button>
                <Link href="/account" className="link">
                    アカウント登録ページへ移動
                </Link>
            </Stack>

            <style jsx>{`
                .login-title {
                    color: #ff3b3b;
                }

                .login-form {
                    background: #f9f9f9;
                    padding: 32px;
                    border-radius: 16px;
                }

                .login-input :global(.MuiInputBase-root) {
                    background-color: white;
                }

                .login-button {
                    background-color: #1976d2;
                    color: white;
                    font-weight: bold;
                }

                .link {
                    color: #1976d2;
                    text-align: center;
                    text-decoration: underline;
                }
            `}</style>
        </Stack>
    );
}
