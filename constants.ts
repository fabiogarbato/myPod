import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cosmic Mango",
    price: 24.99,
    imageUrl: "https://picsum.photos/seed/mango/500/500",
    flavors: ["manga madura", "maracujá", "um toque de citrus"],
    color: 'cyan',
    description: "Uma viagem tropical com o doce da manga madura e o toque cítrico do maracujá. Perfeito para relaxar e sentir a brisa."
  },
  {
    id: 2,
    name: "Cyber Grape",
    price: 22.50,
    imageUrl: "https://picsum.photos/seed/grape/500/500",
    flavors: ["uva caramelizada", "frutas silvestres", "um final refrescante"],
    color: 'purple',
    description: "Sinta a intensidade da uva caramelizada misturada com o frescor das frutas silvestres. Uma experiência futurista e inesquecível."
  },
  {
    id: 3,
    name: "Glacial Mint",
    price: 19.99,
    imageUrl: "https://picsum.photos/seed/mint/500/500",
    flavors: ["menta ártica", "hortelã doce", "uma explosão gelada"],
    color: 'cyan',
    description: "Uma explosão de frescor que combina menta ártica e hortelã doce. Sinta o poder do gelo em cada puff."
  },
  {
    id: 4,
    name: "Neon Berry",
    price: 25.00,
    imageUrl: "https://picsum.photos/seed/berry/500/500",
    flavors: ["framboesa azul elétrica", "morango", "raspas de limão"],
    color: 'pink',
    description: "A energia contagiante da framboesa azul elétrica e do morango fresco, com um final cítrico que acende seus sentidos."
  },
  {
    id: 5,
    name: "Stardust Peach",
    price: 23.75,
    imageUrl: "https://picsum.photos/seed/peach/500/500",
    flavors: ["pêssego suculento", "damasco", "um toque de baunilha"],
    color: 'purple',
    description: "A doçura suculenta do pêssego e do damasco com uma nota suave de baunilha. Um sabor delicado e celestial."
  },
  {
    id: 6,
    name: "Fusion Fizz",
    price: 26.50,
    imageUrl: "https://picsum.photos/seed/fizz/500/500",
    flavors: ["cola de cereja", "cítricos espumantes", "uma sensação efervescente"],
    color: 'pink',
    description: "A nostalgia da cola de cereja com a vibração dos cítricos espumantes. Um sabor que borbulha e surpreende."
  }
];