"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormHelperText } from "@mui/material";

// APIエンドポイントのURLを設定
const API_URL = "http://localhost:8080/signup/";

// バリデーションルール
const rules = {
    required: (value: string) => !!value || "必須項目です",
    noLeadingSpace: (value: string) => !/^\s/.test(value) || "先頭に空白を入れることはできません",
    noFullWidthCharacters: (value: string) => !/[^\x01-\x7E\xA1-\xDF]/.test(value) || "全角文字は使用できません",
    emailFormat: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "正しいメールアドレス形式で入力してください",
};

// 複数バリデーションルールに対応
const runValidationAll = (value: string, ruleList: ((v: string) => true | string)[]): string[] => {
    return ruleList.map((rule) => rule(value)).filter((res): res is string => res !== true);
};

export default function AccountPage() {
    // リダイレクト管理
    const router = useRouter();

    // State状態管理
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; role?: string }>({});

    // 入力値に対してルールを実行し、エラーを保存
    const validateEmail = (value: string) => {
        const emailErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.emailFormat]);
        setErrors((prev) => ({ ...prev, email: emailErrors }));
    };
    const validatePassword = (value: string) => {
        const passwordErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters]);
        setErrors((prev) => ({ ...prev, password: passwordErrors }));
    };
    const validateRole = (value: string) => {
        const roleError = rules.required(value);
        setErrors((prev) => ({ ...prev, role: roleError === true ? undefined : roleError }));
    };

    // 入力フォームを送信したときの動作を定義
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailErrors = runValidationAll(email, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.emailFormat]);
        const passwordErrors = runValidationAll(password, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters]);
        const roleError = rules.required(role);
        setErrors({
            email: emailErrors,
            password: passwordErrors,
            role: roleError === true ? undefined : roleError,
        });

        // すべてのバリデーションに合格したときだけアラートする
        if (emailErrors.length === 0 && passwordErrors.length === 0 && roleError === true) {
            try {
                const params = new URLSearchParams({
                    email,
                    password_hash: password,
                    role,
                });

                const response = await fetch(`${API_URL}?${params.toString()}`, {
                    method: "POST",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`エラーメッセージ: ${JSON.stringify(errorData.detail)}`);
                    return;
                }

                const data = await response.json();
                alert("アカウント登録が成功しました！");
                console.log("登録データ:", data);

                // 登録後にログインページなどにリダイレクト
                router.push("/");
            } catch (error) {
                console.error("APIリクエストに失敗しました:", error);
                alert("サーバーに接続できませんでした。");
            }
        }
    };

    return (
        <Stack height="100lvh" justifyContent="center" alignItems="center" gap="32px">
            <Typography id="login_heading" variant="h1" fontSize="1.5rem" className="login-title">
                アカウント登録
            </Typography>
            <Stack component="form" onSubmit={handleSubmit} width={560} gap="24px" aria-labelledby="login_heading" className="login-form">
                {/* メールアドレス入力 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可 ・全角文字は不可 ・正しいメール形式（例:example@example.com）
                    </Typography>
                    <TextField
                        label="メールアドレス"
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);
                            validateEmail(value);
                        }}
                        error={Boolean(errors.email?.length)}
                        helperText={errors.email?.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    />
                </Stack>

                {/* パスワード入力 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可 ・全角文字は不可
                    </Typography>
                    <TextField
                        label="パスワード"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            validatePassword(value);
                        }}
                        error={Boolean(errors.password?.length)}
                        helperText={errors.password?.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    />
                </Stack>

                {/* アカウント権限 */}
                <FormControl error={Boolean(errors.role)}>
                    <FormLabel id="role-label">アカウント権限（必須）</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="role-label"
                        name="role"
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            validateRole(e.target.value);
                        }}
                    >
                        <FormControlLabel value="manager" control={<Radio />} label="管理者" />
                        <FormControlLabel value="normal" control={<Radio />} label="一般社員" />
                    </RadioGroup>
                    {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                </FormControl>

                <Button variant="contained" className="login-button" type="submit">
                    登録
                </Button>
            </Stack>

            {/*スタイル（CSS in JSX）*/}
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
            `}</style>
        </Stack>
    );
}
