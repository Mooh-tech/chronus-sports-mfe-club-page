<template>

    <div class="row club-presentation m-auto">
        <div class="col-12 col-lg-7 mb-3 mb-lg-0">
            <h1 class="club-presentation-header">
                Salgueiro
                <p class="club-presentation-subheader">
                    Atlético clube
                    <img :src="PrizeFlag" alt="" />
                    <img :src="ChronusFlag" alt="" />
                </p>
            </h1>
            <p>
                Fundado em 1972, o Salgueiro Atlético Clube é o orgulho do Sertão Nordestino,
                personificado em seu mascote - o indomável Carcará. Com suas cores grená, verde e branco, o clube
                escreveu
                história ao se tornar o único time do interior a conquistar o Campeonato Pernambucano (2020).<br>
                Dono de participações memoráveis na Copa do Nordeste, Copa do Brasil e Série B nacional, o Salgueiro
                manda
                seus jogos no Estádio Cornélio de Barros, verdadeiro ninho da combativa torcida grená. Mais que um
                clube, é o
                símbolo da resistência sertaneja, revelando talentos e escrevendo sua trajetória com a garra do povo
                nordestino.
                <br><br>
                <strong>Como o Carcará, o Salgueiro não se rende - voa alto e conquista!</strong>
            </p>
            <div class="club-presentation-valuation">
                <p>
                    R$25.400.000
                </p>
                <small class="helper">
                    <span>Valuation
                    </span>
                </small>
            </div>
            <div class="club-presentation-ranking ">
                <div class="row">
                    <div class="col-12 col-lg-6 mb-3">
                        <h3 class="national-ranking">
                            <img src="@/assets/prize-flag.png" alt="" class="d-block d-lg-none" />
                            148º
                            <img src="@/assets/prize-flag.png" alt="" class="d-none  d-lg-inline-block" />
                            <small class="helper">
                                <span>
                                    Ranking Nacional
                                </span>
                                <img :src="BrazilFlag" alt="" />
                            </small>
                        </h3>
                    </div>
                    <div class="col-12 col-lg-6 mb-3">
                        <h3 class="mundial-ranking">
                            300º
                            <img :src="WorldFlag" alt="" />
                            <small class="helper">
                                <span>
                                    Ranking Mundial
                                </span>
                            </small>
                        </h3>
                    </div>
                    <div class="col-12 col-lg-6 mb-3">
                        <h3 class="rkn-points">
                            <span>
                                352K
                            </span>
                            <small class="helper">Pontos RKN Nacional</small>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-5 mb-3 mb-lg-0 mt-lg-0 mt-3">
            <div class="ranking-shield-wrapper">
                <div class="ranking-number">
                    <span class="ranking-number-text">RNK</span>
                    <span class="ranking-number-position">148</span>
                </div>
                <div class="ranking-shield">
                    <img :src="SalgueiroFc" alt="" />
                </div>
            </div>
        </div>
    </div>

</template>
<script lang="ts" setup>
import BrazilFlag from '@/assets/brazil-flag.png';
import ChronusFlag from '@/assets/chronus-flag.png';
import PrizeFlag from '@/assets/prize-flag.png';
import WorldFlag from '@/assets/world-flag.png';
import SalgueiroFc from '@/assets/salgueiro.png';
</script>
