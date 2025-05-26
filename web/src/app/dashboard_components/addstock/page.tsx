"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Button, Stack, Typography } from "@mui/material";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import Chance from "chance";

// APIエンドポイントのURLを設定
const API_URL = "http://localhost:8080/dashboard/read_stock_list";
const API_URL2 = "http://localhost:8080/dashboard/add_items";

interface AddStockPageProps {
    userRole: string | null;
}

interface Data {
    id: number;
    name: string;
    quantity: number;
}

interface ColumnData {
    dataKey: keyof Data;
    label: string;
    numeric?: boolean;
    width?: number;
}

const chance = new Chance(42);

function createData(id: number): Data {
    return {
        id,
        name: chance.first(),
        quantity: 0,
    };
}

const columns: ColumnData[] = [
    {
        width: 100,
        label: "名前",
        dataKey: "name",
    },
    {
        width: 100,
        label: "数量",
        dataKey: "quantity",
        numeric: true,
    },
];

const VirtuosoTableComponents: TableComponents<Data> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
    Table: (props) => <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed" }} />,
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

export default function AddStockPage({ userRole }: AddStockPageProps) {
    const [selected, setSelected] = React.useState<Set<number>>(new Set());
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
                    id: item.id,
                    name: item.item_name,
                    quantity: 0,
                }));
                setData(formattedData);
            } catch (error) {
                console.error("API取得エラー:", error);
            }
        };
        fetchData();
    }, []);

    const handleUseStock = async () => {
        const token = localStorage.getItem("access_token");

        // チェック済みのデータだけ抽出
        const selectedItems = data
            .filter((item) => selected.has(item.id) && item.quantity > 0)
            .map((item) => ({
                item_name: item.name,
                item_stock: item.quantity,
            }));

        if (selectedItems.length === 0) {
            alert("在庫品目を選択し、数量を入力してください。");
            return;
        }

        try {
            const response = await fetch(API_URL2, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(selectedItems),
            });

            if (!response.ok) {
                throw new Error("在庫追加に失敗しました");
            }

            const result = await response.json();
            console.log("使用結果:", result);
            alert("在庫追加が完了しました。");
        } catch (error) {
            console.error("送信エラー:", error);
            alert("エラーが発生しました。");
        }
    };

    const handleCheckboxToggle = (id: number) => {
        setSelected((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const handleQuantityChange = (id: number, value: number) => {
        setData((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, quantity: value } : row)));
    };

    const fixedHeaderContent = () => (
        <TableRow>
            <TableCell
                padding="checkbox"
                sx={{
                    backgroundColor: "background.paper",
                }}
            />
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? "right" : "left"}
                    style={{ width: column.width }}
                    sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "background.paper",
                        zIndex: 1,
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );

    const rowContent = (_index: number, row: Data) => (
        <>
            <TableCell padding="checkbox">
                <Checkbox checked={selected.has(row.id)} onChange={() => handleCheckboxToggle(row.id)} />
            </TableCell>
            {columns.map((column) => (
                <TableCell key={column.dataKey} align={column.numeric || false ? "right" : "left"}>
                    {column.dataKey === "quantity" ? <TextField type="number" size="small" variant="outlined" value={row.quantity} onChange={(e) => handleQuantityChange(row.id, Number(e.target.value))} inputProps={{ min: 0 }} /> : row[column.dataKey]}
                </TableCell>
            ))}
        </>
    );

    return (
        <Stack height="100vh" justifyContent="center" alignItems="center" gap="32px">
            <Typography id="login_heading" variant="h1" fontSize="1.5rem" className="create-title">
                在庫追加
            </Typography>
            <TableVirtuoso data={data} components={VirtuosoTableComponents} fixedHeaderContent={fixedHeaderContent} itemContent={rowContent} />
            <Button variant="contained" className="add-button" type="submit" fullWidth onClick={handleUseStock}>
                在庫追加
            </Button>

            {/*スタイル（CSS in JSX）*/}
            <style jsx>{`
                .add-button {
                    background-color: #1976d2;
                    color: white;
                    font-weight: bold;
                }
            `}</style>
        </Stack>
    );
}
