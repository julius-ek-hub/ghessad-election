import { useEffect, useState } from "react";

import Link from "next/link";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Loading from "../src/Loading";
import Header from "../src/Header";
import { Divider, IconButton, Typography } from "@mui/material";

const H = ({ info }) => (
  <Header info={info}>
    <Link href="/register_voter">
      <Button
        endIcon={<ArrowForwardIosIcon />}
        sx={{ position: "absolute", top: 2, right: 2 }}
      >
        Add Voter
      </Button>
    </Link>
  </Header>
);

export default function About() {
  const [positions, setPositions] = useState([]);
  const [voters, setVoters] = useState(0);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState("Loading...");
  const [voter_id, setVoteID] = useState(null);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState(null);
  const [vote_id_tmp, setVoteIDTmp] = useState("");
  const [showMessage, setShowMessage] = useState(true);
  const getPositions = async () => {
    try {
      setLoading("Fetching positions...");
      const resp = await fetch("/api/positions");
      const js = await resp.json();

      setPositions(js);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const verifyID = async (id) => {
    try {
      setLoading("Verifying existing member...");
      const resp = await fetch(`/api/voters?id=${id}`);
      const js = await resp.json();
      return js.voter;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    const id = localStorage.getItem("gessad_vote_id");
    if (!id) return null;
    const vf = await verifyID(id);
    if (vf) {
      setVoted(vf.voted);
      vf.admin && localStorage.setItem("gessad_admin", "true");
      setVoteID(id);
      getPositions();
    }
  };
  const getVoters = async () => {
    setLoading("Fetching voters...");
    try {
      const resp = await fetch(`/api/voters`);
      const js = await resp.json();
      if (!js.error) setVoters(js.total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (pk, candidate_index, voted) => {
    if (Date.now() < new Date(info.start).getTime())
      return alert(
        "Election will start on " + new Date(info.start).toDateString()
      );
    if (Date.now() > new Date(info.end).getTime())
      return alert("Election ended on " + new Date(info.end).toDateString());
    try {
      const pos = [...positions];
      setLoading(
        `Voting for ${pos[pk].candidates[candidate_index].name} for ${pos[pk].name}`
      );
      const resp = await fetch("/api/positions?type=vote", {
        method: "post",
        body: JSON.stringify({
          _id: pos[pk]._id,
          candidate_index,
          voter_id,
          voted,
        }),
      });
      const js = await resp.json();

      if (!js.error) {
        pos[pk].candidates = js;
        setPositions(pos);
      }
    } catch (error) {
    } finally {
      setLoading(null);
    }
  };

  const getInfo = async () => {
    try {
      setLoading(`fetching Election Info...`);
      const resp = await fetch("/api/info");
      const js = await resp.json();

      if (!js.error) {
        setInfo(js);
      }
    } catch (error) {
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    getUser();
    getVoters();
    getInfo();
  }, []);

  const verifyUser = async () => {
    if (!vote_id_tmp) return setError(`Voter's ID is required`);
    const vf = await verifyID(vote_id_tmp);
    if (!vf) return setError(`Voter's ID ${vote_id_tmp} does not exists`);
    setVoteID(vote_id_tmp);
    setVoted(vf.voted);
    vf.admin && localStorage.setItem("gessad_admin", "true");
    localStorage.setItem("gessad_vote_id", vote_id_tmp);
    getPositions();
  };

  if (!voter_id)
    return (
      <Container
        maxWidth="sm"
        sx={{
          height: "100vh",
          flexDirection: "column",
          gap: 3,
          p: 0,
        }}
      >
        <Box>
          <H info={info} />
          <Loading loading={loading} />
          {!loading && (
            <Box p={3}>
              <TextField
                error={Boolean(error)}
                value={vote_id_tmp}
                onChange={(e) => {
                  setError(null);
                  setVoteIDTmp(e.target.value.trim());
                }}
                label="Voter's ID"
                margin="dense"
                fullWidth
                placeholder="Please enter your 4 digit voter's ID"
                helperText="This is required to make sure one candidate doesn't get multiple votes. If you don't have a Voter's ID, please contact Gordon. And when you get your ID, do not share it with anyone."
                {...(error && {
                  helperText: error,
                })}
              />
              <Button variant="contained" onClick={verifyUser} sx={{ mt: 2 }}>
                Go Vote
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ px: 0 }}>
      <Box>
        <H info={info} />
        <Typography color="text.secondary" mt={1} mx={4} fontSize="small">
          {voters}/75 have registered to vote.
        </Typography>
        <Box px={4} my={2} position="relative">
          {showMessage &&
            (info.message || "").split("\n").map((m, i) => (
              <Typography color="text.secondary" key={i} mt={1}>
                {m}
              </Typography>
            ))}
          <IconButton
            title={showMessage ? "Hide message." : "Show message"}
            onClick={() => setShowMessage(!showMessage)}
            sx={{ position: "absolute", top: 0, right: 6 }}
            size="small"
          >
            {showMessage ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
        <Divider />
        <Typography color="text.secondary" my={1} mx={4} fontSize="small">
          Vote by tapping on the candidate name corresponding to the position
          you're voting him/her for. You can only vote one person per position
        </Typography>
        <Divider />
        <Box mt={2} px={2}>
          {positions.map((p, pi) => (
            <FormControl
              fullWidth
              key={p.name}
              sx={{
                mb: 4,
                border: (t) => `1px solid ${t.palette.divider}`,
                px: 4,
                py: 2,
                borderRadius: 2,
              }}
            >
              <FormLabel
                sx={{
                  fontSize: 20,
                  color: "text.primary",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                {p.name}
              </FormLabel>
              <RadioGroup>
                {p.candidates
                  .map((c, $key) => ({ ...c, $key }))
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((c) => {
                    const vts = positions[pi].candidates[c.$key].votes;
                    const active = vts.includes(voter_id);
                    const tt = positions[pi].candidates.reduce(
                      (a, b) => a + b.votes.length,
                      0
                    );

                    return (
                      <Box
                        my={0.5}
                        position="relative"
                        width="100%"
                        key={c.id}
                        px={2}
                        borderRadius={2}
                        {...(active && {
                          border: (t) => `1px solid ${t.palette.divider}`,
                          bgcolor: "rgba(0,0,0,0.01)",
                        })}
                      >
                        <FormControlLabel
                          sx={{ width: "100%" }}
                          control={
                            <Radio
                              checked={active}
                              onChange={(e, checked) =>
                                handleCheck(pi, c.$key, checked)
                              }
                            />
                          }
                          label={c.name}
                        />
                        <Box
                          bgcolor={(t) => alpha(t.palette.primary.main, 0.2)}
                          width={
                            tt && tt > 0 ? `${(vts.length / tt) * 100}%` : 0
                          }
                          position="absolute"
                          display="flex"
                          justifyContent="end"
                          alignItems="end"
                          left={0}
                          bottom={0}
                          top={0}
                          sx={{ cursor: "pointer", transition: "300ms width" }}
                          borderRadius="inherit"
                          onClick={(e) =>
                            e.currentTarget.previousElementSibling.click()
                          }
                        />
                        <Box
                          position="absolute"
                          display="flex"
                          justifyContent="end"
                          alignItems="center"
                          pr={2}
                          left={0}
                          bottom={0}
                          top={0}
                          right={0}
                          fontSize="small"
                          sx={{ cursor: "pointer", transition: "300ms width" }}
                          borderRadius="inherit"
                          onClick={(e) =>
                            e.currentTarget.previousElementSibling.click()
                          }
                        >
                          {vts.length}/{tt}
                        </Box>
                      </Box>
                    );
                  })}
              </RadioGroup>
            </FormControl>
          ))}
        </Box>
        <Loading loading={loading} />
      </Box>
    </Container>
  );
}
