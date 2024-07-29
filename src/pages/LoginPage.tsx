import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HOST = "https://test.v5.pryaniky.com";

export default function LoginPage() {
    const navigate = useNavigate();

    const [errors, setErrors] = useState<string[]>([]);

    const onSubmit = (e: any) => {
        e.preventDefault();

        setErrors([]);

        let username = e.target[0].value as string;
        let password = e.target[2].value as string;

        if (!username) {
            setErrors((errors) => [...errors, "username"]);
        }

        if (!password) {
            setErrors((errors) => [...errors, "password"]);
        }

        fetch(`${HOST}/ru/data/v3/testmethods/docs/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error_code) {
                    setErrors(["username", "password"]);
                    return;
                }

                localStorage.setItem("token", res.data.token);
                navigate("/");
            });
    };

    return (
        <div className="w-full h-full flex items-center justify-center h-screen flex-col gap-5">
            <div className="w-fit h-fit border border-[#90caf9] p-8 flex flex-col items-center justify-center gap-5 border-[2px] rounded-lg">
                <Typography variant="h4">Вход</Typography>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                    onSubmit={onSubmit}>
                    <TextField
                        error={errors.includes("username")}
                        type="text"
                        label="Имя пользователя"
                        variant="outlined"
                        helperText={
                            errors.includes("username") &&
                            "Неверное имя пользователя"
                        }
                    />
                    <TextField
                        error={errors.includes("password")}
                        type="password"
                        label="Пароль"
                        variant="outlined"
                        helperText={
                            errors.includes("password") && "Неверный пароль"
                        }
                    />
                    <Button
                        type="submit"
                        variant="contained">
                        Войти
                    </Button>
                </Box>
            </div>
        </div>
    );
}
