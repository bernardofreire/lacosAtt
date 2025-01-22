import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';



export default async function Home() {

  const session = await getServerSession();

  if (session) {
    // Redireciona para o dashboard se o usuário estiver autenticado
    redirect('/app');
  } else {
    // Redireciona para a página de login se não estiver autenticado
    redirect('/auth');
  }


  return null;
}
