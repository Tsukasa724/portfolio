"use client";

import * as React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

interface Column {
    id: "name" | "stock" | "threshold";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "name", label: "名前", minWidth: 170 },
    {
        id: "stock",
        label: "現在庫数",
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
];

// データ作成用の関数
function createData(name: string, stock: number, threshold: number) {
    return { name, stock, threshold, status };
}

// データの配列（行データ）
const rows = [
    createData("India", 1324171354, 3287263),
    createData("China", 1403500365, 9596961),
    createData("Italy", 60483973, 301340),
    createData("United States", 327167434, 9833520),
    createData("Canada", 37602103, 9984670),
    createData("Australia", 25475400, 7692024),
    createData("Germany", 83019200, 357578),
    createData("Ireland", 4857000, 70273),
    createData("Mexico", 126577691, 1972550),
    createData("Japan", 126317000, 377973),
    createData("France", 67022000, 640679),
    createData("United Kingdom", 67545757, 242495),
    createData("Russia", 146793744, 17098246),
    createData("Nigeria", 200962417, 923768),
    createData("Brazil", 210147125, 8515767),
];

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = React.useState(rows);

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
                                {/* 発注完了ボタンの列用の空白見出し */}
                                <TableCell align="right"></TableCell>
                                {/* 取消ボタンの列用の空白見出し */}
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                                        {/* 発注完了ボタン用のセルを追加 */}
                                        <TableCell align="right">
                                            <Link href="/stock_edit" passHref>
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
                                                    発注完了
                                                </Button>
                                            </Link>
                                        </TableCell>
                                        {/* 取消ボタン用のセルを追加 */}
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
                                                取消
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
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
