<template>

  <div class="row historia has-elipsis m-auto mt-5 mb-5">
    <div class="col-12 col-lg-4 text-center mb-5" style="position: relative; z-index: 1">
      <img src="@/assets/salgueiro.png" class="img-fluid club-logo">
    </div>
    <div class="col-12 col-lg-8" style="position: relative; z-index: 1">
      <h1 class="section-title">HISTÓRIA</h1>
      <p style="color: #EEE;">
        Fundado em <strong>23 de março de 1972</strong>, o <strong>Salgueiro Atlético Clube</strong> é muito mais que um
        time de futebol – <strong>é o símbolo de
          resistência e paixão</strong> do Sertão Nordestino. Com as cores grená, verde e branco, o clube carrega em sua
        história momentos
        de glória que transcendem as fronteiras de Pernambuco, tornando-se um <strong>ícone do futebol do interior
          brasileiro</strong>.
        <br><br>
        O maior feito da história do Salgueiro foi a <strong>conquista do Campeonato Pernambucano da Série A1 em
          2020</strong>, quando se
        tornou o <strong>único clube do interior do estado a vencer a elite do futebol pernambucano</strong>. Essa
        vitória não apenas coroou
        anos de trabalho e dedicação, mas também consolidou o time como uma <strong>potência regional</strong>, capaz de
        enfrentar e superar
        os grandes clubes da capital pernambucana.
        <br><br>
        Além do título histórico, o Salgueiro teve <strong>participações marcantes na Copa do Nordeste e na Copa do
          Brasil</strong>, competições
        em que enfrentou equipes tradicionais e mostrou a força do futebol sertanejo. O clube também já disputou a
        <strong>Série B do
          Campeonato Brasileiro</strong>, ampliando sua presença no cenário nacional e conquistando o respeito de
        torcedores e
        adversários.
        <br><br>
        Manda seus jogos no <strong>Estádio Cornélio de Barros</strong>, um verdadeiro <strong>templo do futebol
          sertanejo</strong>, onde sua torcida fiel –
        conhecida por sua <strong>garra e calor humano</strong> – transforma cada partida em uma festa. O Salgueiro não
        é apenas o time da
        cidade de Salgueiro; é <strong>o time de todo o Sertão Nordestino</strong>, representando a <strong>resiliência,
          a determinação e o espírito
          guerreiro</strong> de seu povo.
        <br><br>
        Revelando talentos e escrevendo sua trajetória com <strong>ousadia e amor à camisa</strong>, o Salgueiro
        Atlético Clube segue inspirando
        gerações, provando que, no futebol como na vida, <strong>o sertanejo não desiste nunca. SALGUEIRO, O TIME DO
          NORDESTE!</strong>
      </p>
    </div>
  </div>

</template>
<style scoped>
.has-elipsis {
  position: relative;
}

.has-elipsis::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(7, 116, 156, 0.62);
  mix-blend-mode: hard-light;
  filter: blur(97.5px);
}

.section-title {
  margin-bottom: 4rem;
  font-weight: 900;
  font-size: 3.5rem;
  text-align: center;
  color: #EEE;
}

.historia {
  position: relative;
  padding: 5rem 6rem;
  background: linear-gradient(80.65deg, rgba(19, 55, 128, .2) 5.25%, rgba(35, 88, 193, .2) 100.74%);
  border-radius: 2rem;
}

@media screen and (max-width: 991px){
  .historia{
    padding: 1rem;
  }
}
</style>