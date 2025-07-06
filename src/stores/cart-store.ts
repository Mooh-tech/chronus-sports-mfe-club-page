import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "./login-store";

export interface Product {
  id: number;
  name: string;
  type: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  max_per_user: number;
  available_quantity: number;
  total_quantity: number;
  width: number; // largura em cm
  height: number; // altura em cm
  length: number; // comprimento em cm
  weight: number; // peso em kg
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  delivery_time: number;
  company: string;
}

export const useCartStore = defineStore("cart", () => {
  const toast = useToast();
  const authStore = useAuthStore();

  // Estado
  const items = ref<CartItem[]>([]);
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const loadingProducts = ref(false);
  const loadingShipping = ref(false);
  const isInitialized = ref(false);
  const shippingAddress = ref<ShippingAddress>({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const shippingOptions = ref<ShippingOption[]>([]);
  const selectedShipping = ref<string>("sedex");
  const donationChecked = ref(false);
  const membershipChecked = ref(false);

  // Computed
  const cartItemsCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  const shirtQuantity = computed(() =>
    items.value
      .filter((item) => item.product.type === "Camisa Oficial")
      .reduce((total, item) => total + item.quantity, 0)
  );

  const donationProduct = computed(() =>
    products.value.find(
      (p) => p.type === "lottery_ticket" && p.name.toLowerCase().includes("de")
    )
  );

  const membershipProduct = computed(() =>
    products.value.find(
      (p) =>
        p.type === "membership" && p.name.toLowerCase().includes("torcedor")
    )
  );

  const donationValue = computed(() =>
    donationChecked.value && donationProduct.value
      ? donationProduct.value.price
      : 0
  );

  const membershipValue = computed(() =>
    membershipChecked.value && membershipProduct.value
      ? membershipProduct.value.price
      : 0
  );

  const selectedShippingOption = computed(() =>
    shippingOptions.value.find((option) => option.id === selectedShipping.value)
  );

  const shippingCost = computed(() =>
    selectedShippingOption.value ? selectedShippingOption.value.price : 0
  );

  const total = computed(
    () =>
      subtotal.value +
      donationValue.value +
      membershipValue.value +
      shippingCost.value
  );

  const mainProduct = computed(() =>
    products.value.find((p) => p.type === "Camisa Oficial")
  );

  // Função para salvar carrinho no localStorage
  const saveCartToStorage = () => {
    const cartData = {
      items: items.value,
      shippingAddress: shippingAddress.value,
      donationChecked: donationChecked.value,
      membershipChecked: membershipChecked.value,
      selectedShipping: selectedShipping.value,
    };
    localStorage.setItem("chronus_cart", JSON.stringify(cartData));
  };

  // Função para carregar carrinho do localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem("chronus_cart");
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        items.value = cartData.items || [];
        shippingAddress.value = cartData.shippingAddress || {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
        };
        donationChecked.value = cartData.donationChecked || false;
        membershipChecked.value = cartData.membershipChecked || false;
        selectedShipping.value = cartData.selectedShipping || "sedex";
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
      // Limpar dados corrompidos
      localStorage.removeItem("chronus_cart");
    }
  };

  // Inicializar store
  const initialize = async () => {
    if (isInitialized.value) return;

    // Carregar carrinho do localStorage
    loadCartFromStorage();

    // Carregar produtos se ainda não foram carregados
    if (products.value.length === 0) {
      await fetchProducts();
    }

    isInitialized.value = true;
  };

  // Watchers para salvar automaticamente no localStorage
  watch(items, saveCartToStorage, { deep: true });
  watch(shippingAddress, saveCartToStorage, { deep: true });
  watch(donationChecked, saveCartToStorage);
  watch(membershipChecked, saveCartToStorage);
  watch(selectedShipping, saveCartToStorage);

  // Buscar produtos
  const fetchProducts = async () => {
    if (products.value.length > 0) return; // Já carregados

    loadingProducts.value = true;
    try {
      const response = await fetch(
        "https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/product"
      );
      const data = await response.json();

      if (response.ok) {
        // Normalizar os dados dos produtos
        const normalizedProducts = (data.products || data).map(
          (product: any) => ({
            ...product,
            price:
              typeof product.price === "string"
                ? parseFloat(product.price)
                : product.price,
            stock: product.stock || product.available_quantity || 100,
            max_per_user: product.max_per_user || 5,
          })
        );

        products.value = normalizedProducts;
      } else {
        toast.error("Erro ao carregar produtos");
      }
    } catch (error) {
      toast.error("Erro de conexão ao carregar produtos");
    } finally {
      loadingProducts.value = false;
    }
  };

  // Adicionar item ao carrinho
  const addToCart = (product: Product, quantity: number = 1) => {
    // Verificar se usuário está logado
    if (!authStore.isAuthenticated) {
      toast.error(
        "Para adicionar produtos ao carrinho é necessário estar logado."
      );
      return false;
    }

    // Verificar limite de camisas
    if (product.type === "Camisa Oficial") {
      const newShirtTotal = shirtQuantity.value + quantity;
      if (newShirtTotal > 5) {
        toast.warning(
          `⚠ ATENÇÃO, TORCEDOR!

Para garantir que todos os apaixonados pelo Carcará tenham acesso, a compra da Camisa Oficial Salgueiro 2025 - LOTE I está limitada a:

✅ Máximo de 5 unidades por CPF ou CNPJ

Edição especial de retorno do Carcará - estoques limitados!

Motivo:
✔ Combate à comercialização paralela
✔ Garantia de acesso justo para torcedores`,
          {
            timeout: 8000,
          }
        );
        return false;
      }
    }

    // Verificar se item já existe no carrinho
    const existingItem = items.value.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 5) {
        toast.warning("Quantidade máxima por produto: 5 unidades");
        return false;
      }
      existingItem.quantity = newQuantity;
    } else {
      items.value.push({
        product,
        quantity: Math.min(quantity, 5),
      });
    }

    toast.success(`${product.name} adicionado ao carrinho!`);
    return true;
  };

  // Atualizar quantidade do item
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((item) => item.product.id === productId);
    if (!item) return;

    // Verificar limites
    if (quantity < 1) {
      toast.warning("Quantidade mínima: 1 unidade");
      return;
    }

    if (quantity > 5) {
      toast.warning("Quantidade máxima por produto: 5 unidades");
      return;
    }

    // Verificar limite total de camisas
    if (item.product.type === "Camisa Oficial") {
      const otherShirts = shirtQuantity.value - item.quantity;
      if (otherShirts + quantity > 5) {
        toast.warning(
          `⚠ ATENÇÃO, TORCEDOR!

Para garantir que todos os apaixonados pelo Carcará tenham acesso, a compra da Camisa Oficial Salgueiro 2025 - LOTE I está limitada a:

✅ Máximo de 5 unidades por CPF ou CNPJ

Edição especial de retorno do Carcará - estoques limitados!

Motivo:
✔ Combate à comercialização paralela
✔ Garantia de acesso justo para torcedores`,
          {
            timeout: 8000,
          }
        );
        return;
      }
    }

    item.quantity = quantity;
  };

  // Remover item do carrinho
  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(
      (item) => item.product.id === productId
    );
    if (index !== -1) {
      const item = items.value[index];
      items.value.splice(index, 1);
      toast.success(`${item.product.name} removido do carrinho`);
    }
  };

  // Buscar endereço do usuário logado
  const fetchUserAddress = async () => {
    if (!authStore.isAuthenticated || !authStore.user) return;

    try {
      const response = await fetch(
        `https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/user/address/${authStore.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        shippingAddress.value = {
          cep: data.cep || "",
          logradouro: data.logradouro || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
        };

        // Calcular frete automaticamente se tiver CEP
        if (shippingAddress.value.cep) {
          await calculateShipping(shippingAddress.value.cep);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar endereço do usuário:", error);
    }
  };

  // Buscar CEP via ViaCEP
  const fetchAddressByCep = async (cep: string) => {
    if (!cep || cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        shippingAddress.value.logradouro = data.logradouro || "";
        shippingAddress.value.bairro = data.bairro || "";
        shippingAddress.value.cidade = data.localidade || "";
        shippingAddress.value.estado = data.uf || "";

        // Calcular frete após preencher endereço
        await calculateShipping(cep);
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    }
  };

  // Calcular frete via MelhorEnvio (simulação)
// Configuração do MelhorEnvio
const MELHOR_ENVIO_CONFIG = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMmEwNDFlMjFhNTdjMjlmYTU2YTE5MmVlMWQyYTYyOTE5Y2IyNjJmMTQwNTJlMTFmNzI2Y2FmMzliYjMwODkxMmQyNzg4MjA4ODcwMjA5MzkiLCJpYXQiOjE3NTE3OTU2MjMuMjQ5NjY1LCJuYmYiOjE3NTE3OTU2MjMuMjQ5NjY3LCJleHAiOjE3ODMzMzE2MjMuMjM4NzM1LCJzdWIiOiI5ZjUzMjYwNy1kYWMxLTRhYWItYTA1ZS00NTNhYmU1ZjgxODIiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY29tcGFuaWVzIl19.AckWyeYWFwTnqcvgvJkqBmBVYo4aa32XkoTPP-ypZYVjsSY14we0l4kGyU-NsdFojmCBT7-NWEHTfIlezO1dYRcjisiDzyFwbY-iZ6Zzzvo5muLx2mdt3W9mVAULfp60Wl9VsfLctvapQyLuEqvTJgp0kaMCKuzH2-zd40v_mdwSDi4vr5VInv-pxA3gWLoWlsQ7nnSX4tG8Ck7EAYLkLd1OEzzkgAbJWs97nZUI-aYdOSY3ceYiTr1F_GBxM7KED8XfnN3N79tj8Sgs9Y6mAuXHIN0FUV3RpIZJ8EOiY5C6i8ysaGADUaXWhwBohVE2xlPlsk0_qicaf7-KrctY7HNaYmMaegs661ZBLyJOWNoD7NDTadZ9O9m7ehmdRpQWaefptzWZvEkeYSOh5-0mMe3583NPHfJHn3UXkWaWt9hn_DVoHSSOO9iI2zLvNVTFGQT8XMbGPmaVBurbcuibWeNqY5uqw88lCYRkpZWFQxxsQCiyQ3KkcfhjzDFoUAgDtYDTo-yDF6fxxoczIQfrhCsCkTvYNGY7M9cDXn8mb1-qvjd3eDCdd9Qk8CR8YK4xy-OCyxaul1eFs7LBGfrY9AdF37WbOmW7TVTgbipIAtqN-TdJm3Vx6Nl0F9BI5fP8txuQABXhXq8SjX70830uqjdCvHbytrwQQKaSvWzeon8",
  userAgent: "ChronusSports assinaturas@moohtech.com", // Nome da sua loja + email
  baseUrl: "https://melhorenvio.com.br/api/v2/me", // Produção
  cepOrigem: "51021270",
};

  // Função para calcular frete
  const calculateShipping = async (cep: string) => {
    if (!cep || cartItemsCount.value === 0) return;

  loadingShipping.value = true;
  try {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      toast.error("CEP deve ter 8 dígitos");
      return;
    }

    // Verificar se o token está configurado
    if (!MELHOR_ENVIO_CONFIG.token) {
      throw new Error("Token do MelhorEnvio não configurado");
    }

    const shippingData = {
      from: {
        postal_code: MELHOR_ENVIO_CONFIG.cepOrigem,
      },
      to: {
        postal_code: cleanCep,
      },
      products: items.value.map((item) => ({
        id: item.product.id.toString(),
        width: 12, // Configurar dimensões reais do produto
        height: 4,
        length: 17,
        weight: 0.5,
        insurance_value: item.product.price * item.quantity,
        quantity: item.quantity,
      })),
    };

    //console.log("Enviando dados para MelhorEnvio:", shippingData);

    const response = await fetch(
      `${MELHOR_ENVIO_CONFIG.baseUrl}/shipment/calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${MELHOR_ENVIO_CONFIG.token}`,
          "User-Agent": MELHOR_ENVIO_CONFIG.userAgent,
        },
        body: JSON.stringify(shippingData),
      }
    );

    //    console.log("Resposta da API:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      //console.error('Erro da API MelhorEnvio:', errorData);
      throw new Error(
        `Erro ${response.status}: ${errorData.message || "Erro na API"}`
      );
    }

    const data = await response.json();
    //console.log("Dados retornados:", data);

    // Processar resposta
    const processedOptions: ShippingOption[] = data.map((option: any) => ({
      id: option.service_id || option.id || "unknown",
      name: `${option.company?.name || "Transportadora"} - ${option.name}`,
      price: parseFloat(option.price || option.custom_price || "0"),
      delivery_time: parseInt(option.delivery_time || "0"),
      company: option.company?.name || "Transportadora",
    }));

    const validOptions = processedOptions.filter(
      (option) => option.price > 0 && option.delivery_time > 0
    );

    if (validOptions.length === 0) {
      toast.warning("Nenhuma opção de frete disponível para este CEP");
      return;
    }

    shippingOptions.value = validOptions;

    // Buscar Sedex como padrão
    const sedexOption = validOptions.find((option) =>
      option.name.toLowerCase().includes("sedex")
    );
    selectedShipping.value = sedexOption ? sedexOption.id : validOptions[0].id;

    toast.success("Frete calculado com sucesso!");
  } catch (error) {
    //console.error('Erro ao calcular frete:', error);

    // Fallback com valores simulados
    shippingOptions.value = [
      {
        id: "sedex",
        name: "Sedex",
        price: 35,
        delivery_time: 3,
        company: "Correios",
      },
      {
        id: "pac",
        name: "PAC",
        price: 25,
        delivery_time: 7,
        company: "Correios",
      },
    ];
    selectedShipping.value = "sedex";
    //toast.warning('Erro na API. Usando valores estimados de frete.');
  } finally {
    loadingShipping.value = false;
  }
};

  // Processar checkout
  const processCheckout = async () => {
    // Verificações anteriores permanecem iguais...
    if (!authStore.isAuthenticated) {
      toast.warning(
        'Para finalizar a compra é necessário estar logado. <a href="/login">Realize o login</a> ou <a href="/registro">registre-se</a>',
        { timeout: 5000 }
      );
      return false;
    }

    if (items.value.length === 0) {
      toast.error("Carrinho vazio");
      return false;
    }

    const addressErrors = validateShippingAddress();
    if (addressErrors.length > 0) {
      toast.error(addressErrors[0]);
      return false;
    }

    if (!selectedShippingOption.value) {
      toast.error("Selecione uma opção de entrega");
      return false;
    }

    loading.value = true;
    try {
      // Preparar payload para Stripe Checkout Session
      const checkoutPayload = {
        // Informações do cliente
        customer: {
          id: authStore.user?.id,
          email: authStore.user?.email,
          name: authStore.user?.full_name,
        },

        // URLs de redirecionamento
        success_url: `${window.location.origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/carrinho`,

        // Endereço de entrega
        shipping_address: {
          cep: shippingAddress.value.cep,
          logradouro: shippingAddress.value.logradouro,
          numero: shippingAddress.value.numero,
          complemento: shippingAddress.value.complemento,
          bairro: shippingAddress.value.bairro,
          cidade: shippingAddress.value.cidade,
          estado: shippingAddress.value.estado,
        },

        // Informações de frete
        shipping: {
          option_id: selectedShipping.value,
          option_name: selectedShippingOption.value?.name,
          cost: shippingCost.value * 100, // Converter para centavos
          delivery_time: selectedShippingOption.value?.delivery_time,
          company: selectedShippingOption.value?.company,
        },

        // LINHA DE ITENS ÚNICOS (Stripe line_items)
        line_items: [
          // Produtos do carrinho (camisas, etc.)
          ...items.value.map((item) => ({
            price_data: {
              currency: "brl",
              product_data: {
                name: item.product.name,
                description: item.product.description || "",
                images: item.product.image ? [item.product.image] : [],
                metadata: {
                  product_id: item.product.id.toString(),
                  product_type: item.product.type,
                },
              },
              unit_amount: Math.round(item.product.price * 100), // Centavos
            },
            quantity: item.quantity,
          })),

          // Produto de doação (se selecionado)
          ...(donationChecked.value && donationProduct.value
            ? [
                {
                  price_data: {
                    currency: "brl",
                    product_data: {
                      name: donationProduct.value.name,
                      description:
                        donationProduct.value.description ||
                        "Doação para o clube",
                      images: donationProduct.value.image
                        ? [donationProduct.value.image]
                        : [],
                      metadata: {
                        product_id: donationProduct.value.id.toString(),
                        product_type: donationProduct.value.type,
                        is_donation: "true",
                      },
                    },
                    unit_amount: Math.round(donationProduct.value.price * 100),
                  },
                  quantity: 1,
                },
              ]
            : []),

          // Frete como item de linha
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `Frete - ${selectedShippingOption.value?.name}`,
                description: `Entrega em ${selectedShippingOption.value?.delivery_time} dias úteis`,
                metadata: {
                  is_shipping: "true",
                  shipping_option_id: selectedShipping.value,
                  delivery_time:
                    selectedShippingOption.value?.delivery_time?.toString() ||
                    "0",
                },
              },
              unit_amount: Math.round(shippingCost.value * 100),
            },
            quantity: 1,
          },
        ],

        // DADOS DE ASSINATURA (se houver sócio torcedor)
        ...(membershipChecked.value && membershipProduct.value
          ? {
              subscription_data: {
                metadata: {
                  product_id: membershipProduct.value.id.toString(),
                  product_type: membershipProduct.value.type,
                  customer_id: authStore.user?.id?.toString() || "",
                },
                trial_period_days: 0, // Sem período de teste
              },
              // Adicionar o produto de membership como recurring
              line_items_subscription: [
                {
                  price_data: {
                    currency: "brl",
                    product_data: {
                      name: membershipProduct.value.name,
                      description:
                        membershipProduct.value.description || "Sócio Torcedor",
                      images: membershipProduct.value.image
                        ? [membershipProduct.value.image]
                        : [],
                      metadata: {
                        product_id: membershipProduct.value.id.toString(),
                        product_type: membershipProduct.value.type,
                        is_membership: "true",
                      },
                    },
                    unit_amount: Math.round(
                      membershipProduct.value.price * 100
                    ),
                    recurring: {
                      interval: "month",
                      interval_count: 1,
                    },
                  },
                  quantity: 1,
                },
              ],
            }
          : {}),

        // Metadados adicionais
        metadata: {
          order_type: "ecommerce",
          user_id: authStore.user?.id?.toString() || "",
          cart_items_count: items.value.length.toString(),
          has_donation: donationChecked.value.toString(),
          has_membership: membershipChecked.value.toString(),
          total_amount: Math.round(total.value * 100).toString(),
          shipping_cep: shippingAddress.value.cep,
          created_at: new Date().toISOString(),
        },

        // Configurações do Stripe
        mode:
          membershipChecked.value && membershipProduct.value
            ? "subscription"
            : "payment",
        payment_method_types: ["card", "boleto"],
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["BR"],
        },

        // Dados internos para o backend
        internal_data: {
          cart_snapshot: {
            items: items.value,
            shipping_address: shippingAddress.value,
            shipping_option: selectedShippingOption.value,
            donation_checked: donationChecked.value,
            membership_checked: membershipChecked.value,
            totals: {
              subtotal: subtotal.value,
              shipping: shippingCost.value,
              donation: donationValue.value,
              membership: membershipValue.value,
              total: total.value,
            },
          },
        },
      };

      console.log("Enviando payload para Stripe Checkout:", checkoutPayload);

      // Enviar para o backend
      const response = await fetch(
        "https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/stripe/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(checkoutPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao processar checkout");
      }

      const checkoutResult = await response.json();
      console.log("Resposta do backend:", checkoutResult);

      // Processar resposta do backend
      return await handleCheckoutResponse(checkoutResult);
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error(`Erro ao processar pedido: ${error.message}`);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Nova função para tratar resposta do backend
  const handleCheckoutResponse = async (checkoutResult: any) => {
    try {
      // Caso 1: Stripe Checkout Session criada com sucesso
      if (checkoutResult.success && checkoutResult.checkout_url) {
        toast.success("Redirecionando para pagamento...");

        // Salvar dados do pedido temporariamente (para recuperar depois)
        const orderData = {
          session_id: checkoutResult.session_id,
          order_id: checkoutResult.order_id,
          total_amount: total.value,
          items_count: items.value.length,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(
          "chronus_pending_order",
          JSON.stringify(orderData)
        );

        // Aguardar um pouco antes de redirecionar
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirecionar para o Stripe Checkout
        window.location.href = checkoutResult.checkout_url;
        return true;
      }

      // Caso 2: Pagamento processado diretamente (não deveria acontecer com Checkout Session)
      else if (checkoutResult.success && checkoutResult.payment_confirmed) {
        toast.success("Pagamento confirmado! Redirecionando...");
        clearCart();

        // Redirecionar para página de sucesso
        setTimeout(() => {
          window.location.href = "/sucesso";
        }, 2000);
        return true;
      }

      // Caso 3: Erro conhecido do backend
      else if (!checkoutResult.success && checkoutResult.error) {
        toast.error(checkoutResult.error);
        return false;
      }

      // Caso 4: Resposta inesperada
      else {
        console.warn("Resposta inesperada do backend:", checkoutResult);
        toast.warning("Resposta inesperada do servidor. Tente novamente.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao processar resposta do checkout:", error);
      toast.error("Erro ao processar resposta do servidor");
      return false;
    }
  };

  // Nova função para verificar status de pedido pendente (útil para quando o usuário volta)
  const checkPendingOrder = async () => {
    try {
      const pendingOrderData = localStorage.getItem("chronus_pending_order");
      if (!pendingOrderData) return;

      const orderData = JSON.parse(pendingOrderData);

      // Verificar se o pedido ainda está pendente (opcional)
      // Você pode fazer uma chamada para o backend para verificar o status

      // Se passou mais de 1 hora, limpar dados pendentes
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (new Date(orderData.created_at) < oneHourAgo) {
        localStorage.removeItem("chronus_pending_order");
      }
    } catch (error) {
      console.error("Erro ao verificar pedido pendente:", error);
      localStorage.removeItem("chronus_pending_order");
    }
  };
  const oneTimeTotal = computed(
    () => subtotal.value + shippingCost.value + donationValue.value
  );

  const subscriptionTotal = computed(() => membershipValue.value);

  const hasSubscriptionItems = computed(
    () => membershipChecked.value && membershipProduct.value
  );

  const hasOneTimeItems = computed(
    () =>
      items.value.length > 0 || (donationChecked.value && donationProduct.value)
  );
  const validateShippingAddress = (): string[] => {
    const errors: string[] = [];

    // Validar CEP
    if (!shippingAddress.value.cep || shippingAddress.value.cep.trim() === "") {
      errors.push("CEP é obrigatório");
    } else {
      const cepLimpo = shippingAddress.value.cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) {
        errors.push("CEP deve ter 8 dígitos");
      }
    }

    // Validar logradouro
    if (
      !shippingAddress.value.logradouro ||
      shippingAddress.value.logradouro.trim() === ""
    ) {
      errors.push("Logradouro é obrigatório");
    }

    // Validar número
    if (
      !shippingAddress.value.numero ||
      shippingAddress.value.numero.trim() === ""
    ) {
      errors.push("Número é obrigatório");
    }

    // Validar bairro
    if (
      !shippingAddress.value.bairro ||
      shippingAddress.value.bairro.trim() === ""
    ) {
      errors.push("Bairro é obrigatório");
    }

    // Validar cidade
    if (
      !shippingAddress.value.cidade ||
      shippingAddress.value.cidade.trim() === ""
    ) {
      errors.push("Cidade é obrigatória");
    }

    return errors;
  };

  const isAddressValid = computed(() => {
    return validateShippingAddress().length === 0;
  });

  const canCheckout = computed(() => {
    return (
      authStore.isAuthenticated &&
      items.value.length > 0 &&
      isAddressValid.value &&
      selectedShippingOption.value !== null
    );
  });

  // Limpar carrinho
  const clearCart = () => {
    items.value = [];
    donationChecked.value = false;
    membershipChecked.value = false;
    shippingOptions.value = [];
    selectedShipping.value = "sedex";
    // Também remover do localStorage
    localStorage.removeItem("chronus_cart");
  };

  return {
    // Estado
    items,
    products,
    loading,
    loadingProducts,
    loadingShipping,
    isInitialized,
    shippingAddress,
    shippingOptions,
    selectedShipping,
    donationChecked,
    membershipChecked,

    // Computed
    cartItemsCount,
    subtotal,
    shirtQuantity,
    donationProduct,
    membershipProduct,
    donationValue,
    membershipValue,
    shippingCost,
    total,
    mainProduct,
    selectedShippingOption,
    isAddressValid, // ✅ Novo computed
    canCheckout, // ✅ Novo computed

    // Ações
    initialize,
    fetchProducts,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchUserAddress,
    fetchAddressByCep,
    calculateShipping,
    processCheckout,
    clearCart,
    validateShippingAddress, // ✅ Nova função

    oneTimeTotal,
    subscriptionTotal,
    hasSubscriptionItems,
    hasOneTimeItems,
    handleCheckoutResponse, // ✅ Nova função
    checkPendingOrder, // ✅ Nova função
  };
});
