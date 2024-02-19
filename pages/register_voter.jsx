import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Header from "../src/Header";

export default function About() {
  const [val, setValue] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const r = useRouter();

  const handleRegister = async () => {
    setSuccess(null);
    setError(null);
    const v = val.trim();
    if (v.length < 4)
      return setError("Voter's ID should be at least 4 characters long");
    if (v.split(" ").length > 1)
      return setError("Voter's ID should not contain whitespace");
    setLoading(true);
    const resp = await fetch("/api/voters", { method: "post", body: v });
    const js = await resp.json();
    setLoading(false);
    if (js.error) return setError(js.error);
    setSuccess(js.success);
  };

  useEffect(() => {
    const admin = localStorage.getItem("gessad_admin");
    if (!admin) r.replace("/");
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        gap: 3,
        p: 0,
      }}
    >
      <Header>
        <Link href="/">
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            sx={{ position: "absolute", top: 2, left: 2 }}
          >
            Votes
          </Button>
        </Link>
      </Header>
      <Box px={3} mt={2}>
        {loading && <CircularProgress />}
        {success && <Alert severity="success">{success}</Alert>}
        <TextField
          error={Boolean(error)}
          value={val}
          onChange={(e) => {
            setSuccess(null);
            setError(null);
            setValue(e.target.value);
          }}
          label="Voter's ID"
          margin="dense"
          fullWidth
          placeholder="Please enter a 4 digit ID"
          {...(error && {
            helperText: error,
          })}
        />
        <Button
          variant="contained"
          onClick={handleRegister}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}
