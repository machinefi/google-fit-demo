import { RegisterButton } from "../components/RegisterButton";
import { OuraTokenInput } from "../components/TokenInput";
import Wallet from "../components/Wallet";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12">
      <Wallet>
        <OuraTokenInput />
        <RegisterButton />
      </Wallet>
    </main>
  );
}
