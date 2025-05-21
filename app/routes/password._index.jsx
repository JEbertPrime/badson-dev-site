import {useNavigate, redirect} from '@remix-run/react';
export async function loader() {
  return redirect('/');
}
export default function Password() {
  return <div></div>;
}
