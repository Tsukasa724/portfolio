"use client";

import { Button, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
    return (
        <Stack height="100lvh" justifyContent="center" alignItems="center" gap="32px">
            <Typography id="login_heading" variant="h1" fontSize="1.5rem" className="login-title">
                ログイン
            </Typography>
            <Stack component="form" width={560} gap="24px" aria-labelledby="login_heading" className="login-form">
                <TextField label="メールアドレス" className="login-input" />
                <TextField label="パスワード" className="login-input" />
                <Button variant="contained" className="login-button">
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
