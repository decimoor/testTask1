import React, { useState } from "react";

// types
import { TRow } from "../../types";

// mui components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { Button, LinearProgress, Typography } from "@mui/material";

const HOST = "https://test.v5.pryaniky.com";

interface CRUDDialogInterface {
    open: boolean;
    selectedValue: TRow | undefined;
    createNew: boolean;
    onClose: () => void;
    updateData: (value: TRow) => void;
    createNewData: (value: TRow) => void;
    deleteData: (id: string) => void;
}

export default function CRUDDialog({
    open,
    selectedValue,
    createNew,
    onClose,
    updateData,
    createNewData,
    deleteData,
}: CRUDDialogInterface) {
    const [pending, setPending] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[] | never>([]);

    const onSubmit = (e: any) => {
        setErrors([]);
        e.preventDefault();

        if (!selectedValue) return;

        const data: TRow = {
            id: selectedValue.id,
            companySigDate:
                e.target[0].value +
                `${e.target[0].value.includes("Z") ? "" : "Z"}`,
            companySignatureName: e.target[1].value,
            documentName: e.target[3].value,
            documentStatus: e.target[5].value,
            documentType: e.target[7].value,
            employeeNumber: e.target[9].value,
            employeeSigDate:
                e.target[11].value +
                `${e.target[11].value.includes("Z") ? "" : "Z"}`,
            employeeSignatureName: e.target[12].value,
        };

        let errorsBuf: string[] = [];

        Object.entries(data).map(([key, value]) => {
            console.log(value);
            if ((value.length === 0 || value[0] === "Z") && key !== "id") {
                errorsBuf.push(key);
            }
        });

        setErrors(errorsBuf);
        console.log(errorsBuf);

        if (errorsBuf.length) {
            console.log(errorsBuf);
            return;
        }

        setPending(true);

        if (!createNew) {
            fetch(
                `${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${selectedValue.id}`,
                {
                    method: "POST",
                    headers: {
                        "x-auth": `${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.error_code) {
                        console.log(response);
                        return;
                    }

                    setPending(false);
                    updateData(data);
                    handleClose();
                });

            return;
        }

        // creating new instance

        const { id, ...dataWithoutId } = data;

        fetch(`${HOST}/ru/data/v3/testmethods/docs/userdocs/create`, {
            method: "POST",
            headers: {
                "x-auth": `${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataWithoutId),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error_code) {
                    console.log(response);
                    return;
                }

                setPending(false);
                handleClose();
                createNewData(response.data);
            });
    };

    const handleClose = () => {
        onClose();
        setErrors([]);
    };

    const handleDelete = () => {
        if (!selectedValue) return;
        setPending(true);

        fetch(
            `${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${selectedValue.id}`,
            {
                headers: {
                    "x-auth": `${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((response) => {
                if (response.code) {
                    console.log(response);
                    return;
                }

                deleteData(selectedValue.id);
                handleClose();
                setPending(false);
            });
    };

    return (
        <Dialog
            onClose={handleClose}
            open={open}>
            {!createNew && (
                <DialogTitle>Измените или удалите данные</DialogTitle>
            )}
            <div className="w-[84dvw] md:w-[400px]">
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        padding: "30px",
                    }}
                    onSubmit={onSubmit}>
                    <Typography>Дата подписи компании</Typography>
                    <input
                        type="datetime-local"
                        defaultValue={
                            createNew
                                ? ""
                                : selectedValue?.companySigDate?.slice(0, -1) ||
                                  0
                        }
                        disabled={pending}
                        step={0.001}
                        className={
                            errors.includes("companySigDate")
                                ? "border rounded-sm border-red-400"
                                : ""
                        }
                    />
                    <TextField
                        error={errors.includes("companySignatureName")}
                        id="companySignatureName"
                        label="Название"
                        variant="outlined"
                        defaultValue={
                            createNew ? "" : (selectedValue?.companySignatureName)
                        }
                        disabled={pending}
                    />
                    <TextField
                        id="documentName"
                        label="Название документа"
                        variant="outlined"
                        defaultValue={
                            createNew ? "" : selectedValue?.documentName
                        }
                        disabled={pending}
                        error={errors.includes("documentName")}
                    />
                    <TextField
                        id="documentStatus"
                        label="Статус документа"
                        variant="outlined"
                        defaultValue={
                            createNew ? "" : selectedValue?.documentStatus
                        }
                        disabled={pending}
                        error={errors.includes("documentStatus")}
                    />
                    <TextField
                        id="documentType"
                        label="Тип документа"
                        variant="outlined"
                        defaultValue={
                            createNew ? "" : selectedValue?.documentType
                        }
                        disabled={pending}
                        error={errors.includes("documentType")}
                    />
                    <TextField
                        id="employeeNumber"
                        label="Номер работника"
                        variant="outlined"
                        defaultValue={
                            createNew ? "" : selectedValue?.employeeNumber
                        }
                        disabled={pending}
                        error={errors.includes("employeeNumber")}
                    />
                    <Typography>Дата подписи</Typography>
                    <input
                        type="datetime-local"
                        defaultValue={
                            createNew
                                ? ""
                                : selectedValue?.employeeSigDate?.slice(
                                      0,
                                      -1
                                  ) || "0-0-0T-0:0:0:.000Z"
                        }
                        disabled={pending}
                        step={0.001}
                        className={
                            errors.includes("employeeSigDate")
                                ? "border rounded-sm border-red-400"
                                : ""
                        }
                    />
                    <TextField
                        id="employeeSignatureName"
                        label="Название подписи"
                        variant="outlined"
                        defaultValue={
                            createNew ? "" : selectedValue?.employeeSignatureName
                        }
                        disabled={pending}
                        error={errors.includes("employeeSignatureName")}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={pending}>
                        {createNew ? "Добавить" : "Изменить"}
                    </Button>
                    {!createNew && (
                        <Button
                            variant="outlined"
                            disabled={pending}
                            onClick={handleDelete}>
                            Удалить
                        </Button>
                    )}
                    {pending && <LinearProgress />}
                </Box>
            </div>
        </Dialog>
    );
}
