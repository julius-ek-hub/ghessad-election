import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";

export default function Header({ children, info }) {
  const [is_admin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(Boolean(localStorage.getItem("gessad_admin")));
  }, [info]);

  const goodDate = (d) => {
    const n = new Date(d);

    return `${n.toDateString().split(" ").slice(1, 3).join(" ")}, ${
      d.split("T")[1]
    }`;
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      position="relative"
      alignItems="center"
      p={4}
      gap={1}
      flexDirection="column"
      bgcolor={(t) => t.palette.action.hover}
      borderBottom={(t) => `1px solid ${t.palette.divider}`}
    >
      <Avatar
        src="/gessad-logo.jpeg"
        alt="GESSAD Logo"
        sx={{ height: 70, width: 70 }}
      />
      <Typography variant="h6" textAlign="center" color="text.secondary">
        GESSAD Executive Election Feb 2024
      </Typography>
      {is_admin && children}
      <Box
        display="flex"
        justifyContent="space-between"
        gap={1}
        color="text.secondary"
        fontSize="small"
        width=" 100%"
        position="absolute"
        bottom={0}
        p={1}
        px={2}
      >
        {info?.start && info?.end && (
          <>
            <Box> Start: {goodDate(info.start)}</Box>
            <Box>End: {goodDate(info.end)}</Box>
          </>
        )}
      </Box>
    </Box>
  );
}
