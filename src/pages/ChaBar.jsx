import PageHeading from '../components/PageHeading'
import ShowerChecklist from '../components/ShowerChecklist'

export default function ChaBar() {
  return (
    <div>
      <PageHeading
        eyebrow="Chá Bar"
        title="10 passos para organizar o seu Chá Bar"
        description="Do início ao fim: marque cada passo conforme for resolvendo, e adicione o que for específico da sua festa."
      />
      <ShowerChecklist tipo="Chá Bar" />
    </div>
  )
}
