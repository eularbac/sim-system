import PageHeading from '../components/PageHeading'
import ShowerChecklist from '../components/ShowerChecklist'

export default function ChaPanela() {
  return (
    <div>
      <PageHeading
        eyebrow="Chá de Panela"
        title="10 passos para organizar o seu Chá de Panela"
        description="Do início ao fim: marque cada passo conforme for resolvendo, e adicione o que for específico da sua festa."
      />
      <ShowerChecklist tipo="Chá de Panela" />
    </div>
  )
}
