import React, { FC } from 'react';
type ResetPasswordProps = {
  token: string | null;
  setActiveState: (route: string) => void;
};
const ResetPassword: FC<ResetPasswordProps> = ({ setActiveState, token }) => {
  console.log(token);
  return <div>ResetPassword</div>;
};

export default ResetPassword;
