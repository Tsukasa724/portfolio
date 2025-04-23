"use client";

import * as React from "react";
import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";

// バリデーションルール
const rules = {
    required: (value: string) => !!value || "必須項目です",
    noLeadingSpace: (value: string) => !/^\s/.test(value) || "先頭に空白を入れることはできません",
    noFullWidthCharacters: (value: string) => !/[^\x01-\x7E\xA1-\xDF]/.test(value) || "全角文字は使用できません",
    numericOnly: (value: string) => /^\d+$/.test(value) || "数字のみ入力してください",
};

// 複数バリデーションルールに対応
const runValidationAll = (value: string, ruleList: ((v: string) => true | string)[]): string[] => {
    return ruleList.map((rule) => rule(value)).filter((res): res is string => res !== true);
};

export default function CreatePage() {
    // State状態管理
    const [name, setName] = useState("");
    const [threshold, setThreshold] = useState("");
    const [stock, setStock] = useState("");
    const [errors, setErrors] = useState<{ name?: string[]; threshold?: string[]; stock?: string[] }>({});

    // 入力値に対してルールを実行し、エラーを保存
    const validateName = (value: string) => {
        const nameErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters]);
        setErrors((prev) => ({ ...prev, name: nameErrors }));
    };
    const validateThreshold = (value: string) => {
        const thresholdErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.numericOnly]);
        setErrors((prev) => ({ ...prev, threshold: thresholdErrors }));
    };

    const validateStock = (value: string) => {
        const stockErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.numericOnly]);
        setErrors((prev) => ({ ...prev, stock: stockErrors }));
    };

    // 入力フォームを送信したときの動作を定義
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nameErrors = runValidationAll(name, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters]);
        const thresholdErrors = runValidationAll(threshold, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.numericOnly]);
        const stockErrors = runValidationAll(stock, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.numericOnly]);
        setErrors({
            name: nameErrors,
            threshold: thresholdErrors,
            stock: stockErrors,
        });

        // すべてのバリデーションに合格したときだけアラートする
        if (nameErrors.length === 0 && thresholdErrors.length === 0 && stockErrors.length === 0) {
            alert("バリデーション成功！");
        }
    };

    return (
        <Stack height="100lvh" justifyContent="center" alignItems="center" gap="32px">
            <Typography id="login_heading" variant="h1" fontSize="1.5rem" className="create-title">
                在庫新規登録
            </Typography>
            <Stack component="form" onSubmit={handleSubmit} width={560} gap="24px" aria-labelledby="login_heading" className="create-form">
                {/* 名前入力 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可
                    </Typography>
                    <TextField
                        label="名前"
                        value={name}
                        onChange={(e) => {
                            const value = e.target.value;
                            setName(value);
                            validateName(value);
                        }}
                        error={Boolean(errors.name?.length)}
                        helperText={errors.name?.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    />
                </Stack>

                {/* 閾値入力 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可 ・全角文字は不可 ・数字のみ入力可
                    </Typography>
                    <TextField
                        label="閾値"
                        value={threshold}
                        onChange={(e) => {
                            const value = e.target.value;
                            setThreshold(value);
                            validateThreshold(value);
                        }}
                        error={Boolean(errors.threshold?.length)}
                        helperText={errors.threshold?.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    />
                </Stack>

                {/* 在庫数入力 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可 ・全角文字は不可 ・数字のみ入力可
                    </Typography>
                    <TextField
                        label="在庫数"
                        value={stock}
                        onChange={(e) => {
                            const value = e.target.value;
                            setStock(value);
                            validateStock(value);
                        }}
                        error={Boolean(errors.stock?.length)}
                        helperText={errors.stock?.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    />
                </Stack>

                <Button variant="contained" className="create-button" type="submit">
                    登録
                </Button>
            </Stack>

            {/*スタイル（CSS in JSX）*/}
            <style jsx>{`
                .create-title {
                    color: #ff3b3b;
                }

                .create-form {
                    background: #f9f9f9;
                    padding: 32px;
                    border-radius: 16px;
                }

                .create-button {
                    background-color: #1976d2;
                    color: white;
                    font-weight: bold;
                }
            `}</style>
        </Stack>
    );
}
