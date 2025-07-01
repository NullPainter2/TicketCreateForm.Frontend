import Alert from "@mui/material/Alert"
import Link from "@mui/material/Link"

export const ErrorMessage: React.FC<React.PropsWithChildren<{text: string, onClick: () => void}>> = ({ text, onClick }) => {
  return (
    <Alert variant="filled" severity="error">
        {text}
        {" "}
        <Link
          onClick={onClick}
          sx={{color: '#fff', textDecorationColor: '#fff', cursor: 'pointer'}}
        >
          Stáhnout znovu
        </Link>
    </Alert>
  )
}
