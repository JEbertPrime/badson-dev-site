import {useNavigate} from '@remix-run/react';

export default function Password() {
  const nav = useNavigate();
  nav('/');
  return <div></div>;
}
