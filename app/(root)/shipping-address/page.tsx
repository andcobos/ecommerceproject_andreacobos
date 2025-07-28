import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import ShippingAddressForm from './shipping-address-form';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  // 1️⃣ Validar sesión primero
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    // Si no hay sesión, redirige al login
    redirect('/sign-in');
  }

  // 2️⃣ Obtener carrito (solo si hay sesión)
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  // 3️⃣ Obtener datos de usuario
  const user = await getUserById(session.user.id);

  return (
    <>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
