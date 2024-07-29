import React, { useEffect,  useState } from "react";


import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Button, createTheme, ThemeProvider } from "@mui/material";
import { blue } from "@mui/material/colors";

import CRUDDialog from "../components/CRUDDialog";
import { TRow } from "../../types";

import { Link, useNavigate } from "react-router-dom";

const theme = createTheme({
    palette: {
        primary: blue,
    },
});

const HOST = "https://test.v5.pryaniky.com"

function MainPage() {

    let token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [createNew, setCreateNew] = useState<boolean>(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login")
        }

        fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/get`, {
            headers: {
                "x-auth": `${token}`,
            },
        }).then(res => res.json())
        .then(response => {
            if (response.error_code) {
                console.log("error", response);
                return;
            }

            const data = response.data as TRow[];
            console.log(response.data);
            setRows(data);

        })

    }, [])


    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TRow | undefined>();
    const [rows, setRows] = useState<TRow[] | never[]>([]);

    const handleClose = () => {
        setOpen(false);
        setCreateNew(false);
    };

    const onOpen = (value: TRow) => {
        setSelectedRow(value);
        setOpen(true);
    }

    const updateData = (value: TRow) => {
        setRows(prevState => prevState.map(row => row.id === value.id ? {...value} : row));
    }

    const handleCreateNew = () => {
        setCreateNew(true);
        setOpen(true);
    }

    const handleCreateNewData = (value: TRow) => {
        setRows(prevState => [value, ...prevState])
    }

    const handleDeleteData = (id: string) => {
        setRows(prevState => prevState.filter(row => row.id !== id));
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="container mx-auto px-2 mb-20">
                <header className="my-2">
                    <Link to={"/login"} >
                        <Button variant="outlined">
                            Войти
                        </Button>
                    </Link>
                </header>
                {/* table */}
                <div>
                    <CRUDDialog
                        selectedValue={selectedRow}
                        open={open}
                        onClose={handleClose}
                        updateData={updateData}
                        createNew={createNew}
                        createNewData={handleCreateNewData}
                        deleteData={handleDeleteData}
                    />
                    <TableContainer
                        component={Paper}
                        className="bg-hover">
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Дата пописи компании
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Название
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Название документа
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Статус документа
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Тип документа
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Номер работника
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Дата подписи
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "white",
                                        }}
                                        align="center">
                                        Название подписи
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => {
                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    { border: 0 },
                                                transition: "all .3s linear",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    backgroundColor: "#00bcd4",
                                                },
                                            }}
                                            onClick={() => onOpen(row)}>
                                            <TableCell
                                                component={"th"}
                                                scope="row">
                                                {row.companySigDate? new Date(row.companySigDate).toLocaleString() : "Неизвестно"}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.companySignatureName}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.documentName}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.documentStatus}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.documentType}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.employeeNumber}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.employeeSigDate ?  new Date(row.employeeSigDate).toLocaleString() : "Неизвестно"}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.employeeSignatureName}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="outlined" sx={{width: "100%", marginTop: "10px"}} onClick={handleCreateNew}>
                        Создать новую запись
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default MainPage;