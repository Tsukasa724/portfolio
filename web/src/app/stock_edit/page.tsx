"use client";

import * as React from "react";
import { useState } from "react";
import { Button, Stack, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormHelperText } from "@mui/material";

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

export default function EditPage() {
    // State状態管理
    const [name, setName] = useState("");
    const [threshold, setThreshold] = useState("");
    const [errors, setErrors] = useState<{ name?: string[]; threshold?: string[] }>({});

    // 入力値に対してルールを実行し、エラーを保存
    const validateName = (value: string) => {
        const nameErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters]);
        setErrors((prev) => ({ ...prev, name: nameErrors }));
    };
    const validateThreshold = (value: string) => {
        const thresholdErrors = runValidationAll(value, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.numericOnly]);
        setErrors((prev) => ({ ...prev, threshold: thresholdErrors }));
    };

    // 入力フォームを送信したときの動作を定義
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nameErrors = runValidationAll(name, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters]);
        const thresholdErrors = runValidationAll(threshold, [rules.required, rules.noLeadingSpace, rules.noFullWidthCharacters, rules.numericOnly]);
        setErrors({
            name: nameErrors,
            threshold: thresholdErrors,
        });

        // すべてのバリデーションに合格したときだけアラートする
        if (nameErrors.length === 0 && thresholdErrors.length === 0) {
            alert("バリデーション成功！");
        }
    };

    return (
        <Stack height="100lvh" justifyContent="center" alignItems="center" gap="32px">
            <Typography id="login_heading" variant="h1" fontSize="1.5rem" className="edit-title">
                在庫編集
            </Typography>
            <Stack component="form" onSubmit={handleSubmit} width={560} gap="24px" aria-labelledby="login_heading" className="edit-form">
                {/* 名前編集 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可
                    </Typography>
                    <TextField
                        label="現在の在庫物"
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

                {/* 閾値編集 */}
                <Stack spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                        ・必須項目 ・先頭に空白は不可 ・全角文字は不可 ・数字のみ入力可
                    </Typography>
                    <TextField
                        label="現在の閾値"
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

                <Button variant="contained" className="edit-button" type="submit">
                    編集
                </Button>
            </Stack>

            {/*スタイル（CSS in JSX）*/}
            <style jsx>{`
                .edit-title {
                    color: #ff3b3b;
                }

                .edit-form {
                    background: #f9f9f9;
                    padding: 32px;
                    border-radius: 16px;
                }

                .edit-button {
                    background-color: #1976d2;
                    color: white;
                    font-weight: bold;
                }
            `}</style>
        </Stack>
    );
}
