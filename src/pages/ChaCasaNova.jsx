import PageHeading from '../components/PageHeading'
import ShowerChecklist from '../components/ShowerChecklist'

export default function ChaCasaNova() {
  return (
    <div>
      <PageHeading
        eyebrow="Chá de Casa Nova"
        title="10 passos para organizar o seu Chá de Casa Nova"
        description="Do início ao fim: marque cada passo conforme for resolvendo, e adicione o que for específico da sua festa."
      />
      <ShowerChecklist tipo="Chá de Casa Nova" />
    </div>
  )
}
