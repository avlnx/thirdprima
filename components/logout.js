import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "evergreen-ui"

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <Button intent="danger" appearance="minimal" onClick={() => logout()}>Sair</Button>;
};

export default LogoutButton;