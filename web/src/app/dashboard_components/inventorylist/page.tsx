"use client";

import * as React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

// APIエンドポイントのURLを設定
const API_URL = "http://localhost:8080/dashboard/read_item_list";

interface InventoryListPageProps {
    userRole: string | null;
}

interface Column {
    id: "name" | "stock" | "threshold" | "status";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "name", label: "名前", minWidth: 170 },
    {
        id: "stock",
        label: "在庫数",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString("en-US"),
    },
    {
        id: "threshold",
        label: "閾値",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString("en-US"),
    },
    {
        id: "status",
        label: "在庫状況",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toFixed(2),
    },
];

export default function InventoryListPage({ userRole }: InventoryListPageProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = React.useState<any[]>([]);

    // APIからデータ取得
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("データの取得に失敗しました");
                }
                const result = await response.json();
                console.log(result);
                const formattedData = result.data.map((item: any) => ({
                    name: item.item_name,
                    stock: item.item_stock,
                    threshold: item.order_threshold,
                    status: item.stock_status,
                    id: item.id,
                }));
                setData(formattedData);
            } catch (error) {
                console.error("API取得エラー:", error);
            }
        };
        fetchData();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDelete = (name: string) => {
        const newData = data.filter((row) => row.name !== name);
        setData(newData);
    };

    return (
        <Stack>
            {userRole === "manager" && (
                <div className="create-button">
                    <Link href="/stock_create" passHref>
                        <Button variant="outlined" component="a">
                            新規作成
                        </Button>
                    </Link>
                </div>
            )}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                {userRole === "manager" && (
                                    <>
                                        {/* 編集ボタンの列用の空白見出し */}
                                        <TableCell align="right"></TableCell>
                                        {/* 削除ボタンの列用の空白見出し */}
                                        <TableCell align="right"></TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === "number" ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                        {userRole === "manager" && (
                                            <>
                                                {/* 編集ボタン用のセルを追加 */}
                                                <TableCell align="right">
                                                    <Link href={`/stock_edit?id=${row.id}`} passHref>
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                minWidth: 80,
                                                                padding: "4px 8px",
                                                                whiteSpace: "nowrap",
                                                                fontSize: {
                                                                    xs: "0.7rem", // スマホサイズ
                                                                    sm: "0.8rem", // タブレットサイズ
                                                                    md: "0.9rem", // 通常サイズ
                                                                },
                                                            }}
                                                        >
                                                            編集
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                                {/* 削除ボタン用のセルを追加 */}
                                                <TableCell align="right">
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleDelete(row.name)}
                                                        sx={{
                                                            minWidth: 80,
                                                            padding: "4px 8px",
                                                            whiteSpace: "nowrap",
                                                            fontSize: {
                                                                xs: "0.7rem", // スマホサイズ
                                                                sm: "0.8rem", // タブレットサイズ
                                                                md: "0.9rem", // 通常サイズ
                                                            },
                                                        }}
                                                    >
                                                        削除
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={data.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
            </Paper>

            {/*スタイル（CSS in JSX）*/}
            <style jsx>{`
                .create-button {
                    margin-bottom: 16px;
                }
            `}</style>
        </Stack>
    );
}
