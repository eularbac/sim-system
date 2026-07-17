import PageHeading from '../components/PageHeading'
import SimpleChecklist from '../components/SimpleChecklist'

export default function FoodDrink() {
  return (
    <div>
      <PageHeading
        eyebrow="Comes e Bebes"
        title="O que fechar com o buffet"
        description="Cada detalhe combinado aqui é uma preocupação a menos na sua cabeça."
      />
      <SimpleChecklist table="food_drink_checklist" placeholder="Ex: Cardápio degustação, bar de drinks..." />
    </div>
  )
}
