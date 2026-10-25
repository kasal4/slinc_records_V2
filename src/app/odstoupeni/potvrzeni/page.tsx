export const metadata = { title: "Odstoupení potvrzeno" };

export default function WithdrawalDonePage({
  searchParams,
}: {
  searchParams: { objednavka?: string };
}) {
  return (
    <section className="hero">
      <div className="flash">
        Odstoupení od smlouvy {searchParams.objednavka} jsme přijali.
      </div>
      <p>
        Zboží zašlete na adresu prodávajícího. Peníze vracíme po převzetí kazet,
        nejpozději ve lhůtě podle občanského zákoníku.
      </p>
    </section>
  );
}
