import type { Locale } from "@/lib/locales";

export type NewsArticleImage = {
  aspectRatio?: string;
  featured?: boolean;
  src: string;
  alt: string;
};

export type NewsArticleSection = {
  title: string;
  body: string[];
  images: NewsArticleImage[];
};

export type NewsArticleContent = {
  dateline: string;
  heroFormat?: "landscape" | "portrait" | "standard";
  heroImage?: string;
  introduction: string[];
  sections: NewsArticleSection[];
  video?: {
    poster?: string;
    src: string;
    title: string;
  };
};

const designShanghaiImageRoot = "/uploads/news/2024 Design Shanghai";
const alcantaraContractImageRoot = "/uploads/news/2025 Alcantara distribution contract";
const tokyoAutoSalonImageRoot = "/uploads/news/2026 Tokyo Auto Salon";

const newsArticles: Record<string, Partial<Record<Locale, NewsArticleContent>>> = {
  "alcantara-design-shanghai-2024": {
    en: {
      dateline: "Shanghai, China / June 2024",
      introduction: [
        "Design Shanghai 2024 came to a close on 22 June, concluding a memorable edition filled with inspiring encounters and moments worth revisiting.",
        "CAMARI joined the exhibition with a material portfolio spanning Alcantara, premium leather, automotive fabrics, and bespoke surface solutions. Together, these collections demonstrated how colour, texture, and process can support interior, mobility, fashion, and product applications.",
        "Designed by AWHITE DESIGN, CAMARI's pavilion was wrapped almost entirely in Alcantara. From the outside, it appeared like a beautifully presented gift: soft, tactile, and quietly surprising. Inside, it became a stage for the material's artistic character and remarkable versatility."
      ],
      sections: [
        {
          title: "ALCANTARA × WEIMO",
          body: [
            "At the heart of the pavilion was a WEIMO furniture piece by renowned designer Wu Bin, upholstered in Alcantara 1100 Sea Sand and 1070 Corn. Drawing on classic Western design from the 1940s and 1950s, WEIMO reframes familiar forms through a contemporary Eastern perspective.",
            "For the Moxiang lounge chair, the original textile upholstery was replaced with Alcantara. Its sculptural wrapping and artful panel work evoke an exchange between Eastern and Western cultures. An oak frame, assembled with mortise-and-tenon joints, is shaped into finely resolved legs through three-dimensional surface work. The backrest and seat meet at a relaxed angle, while the inward-tapering base and precisely judged height differences support the chair naturally, inviting a calm and informal posture."
          ],
          images: [
            {
              src: `${designShanghaiImageRoot}/ds2.jpg`,
              alt: "Designer Wu Bin and guests beneath the suspended WEIMO lounge chair at Design Shanghai"
            },
            {
              src: `${designShanghaiImageRoot}/ds3.jpg`,
              alt: "Designer Wu Bin discussing the WEIMO furniture installation"
            },
            {
              src: `${designShanghaiImageRoot}/ds4.jpg`,
              alt: "The Moxiang lounge chair upholstered in Alcantara at Design Shanghai 2024"
            }
          ]
        },
        {
          title: "ALCANTARA × Iris van Herpen",
          body: [
            "Another highlight was a sculptural work by visionary Dutch designer Iris van Herpen. Meticulously crafted in Alcantara, the garment placed visitors in an almost virtual environment. Fine white lines of Alcantara radiated in every direction against the dark setting, transforming the silhouette into an immersive study of movement, light, and material."
          ],
          images: [
            {
              src: `${designShanghaiImageRoot}/ds5.jpg`,
              alt: "Iris van Herpen's sculptural Alcantara garment presented at Design Shanghai"
            },
            {
              src: `${designShanghaiImageRoot}/ds6.jpg`,
              alt: "Detail of the flowing white lines on Iris van Herpen's Alcantara garment"
            }
          ]
        },
        {
          title: "ALCANTARA: Infinite Possibilities",
          body: [
            "A broad library of colours and tactile samples invited visitors to experience the collection at close range. Across colour, finish, and process, Alcantara revealed an expansive range of possibilities for interiors, automotive design, fashion, and beyond."
          ],
          images: [
            {
              src: `${designShanghaiImageRoot}/ds7.jpg`,
              alt: "Visitors exploring Alcantara colour samples for interior and automotive applications"
            },
            {
              src: `${designShanghaiImageRoot}/ds8.jpg`,
              alt: "A visitor feeling the texture of an Alcantara sample at Design Shanghai"
            }
          ]
        }
      ]
    },
    ja: {
      dateline: "中国・上海 / 2024年6月",
      introduction: [
        "Design Shanghai 2024は6月22日に閉幕しました。会期中は、数多くの刺激的な出会いと、記憶に残る瞬間に恵まれました。",
        "カマリは今回、アルカンターラ、プレミアムレザー、自動車用ファブリック、特注サーフェスマテリアルにわたる幅広い素材ポートフォリオを紹介しました。色彩、質感、加工技術を組み合わせることで、インテリア、モビリティ、ファッション、プロダクトデザインへ広がる可能性を提案しました。",
        "AWHITE DESIGNが手がけたカマリのパビリオンは、外装のほぼ全面をアルカンターラで包み込みました。外から見ると、柔らかな驚きを秘めた美しいギフトのようであり、内部は素材の芸術性と多用途性を体感できる舞台として構成されました。"
      ],
      sections: [
        {
          title: "アルカンターラ × WEIMO",
          body: [
            "パビリオンの中心には、著名なデザイナー、Wu Bin（ウー・ビン）氏が手がけたWEIMOの家具作品を展示しました。アルカンターラ 1100 Sea Sandと1070 Cornを用いたこの作品は、1940年代から1950年代の西洋クラシックデザインから着想を得ながら、現代的な東洋の視点で再解釈されています。",
            "「墨想（Moxiang）」ラウンジチェアでは、従来のファブリック張りをアルカンターラに置き換え、彫刻的な包み込みと繊細なパネルワークによって東西の文化が交差する記憶を表現しています。オーク材のフレームはほぞ継ぎで組み上げられ、三次元曲面の加工によって脚部を端正に成形。背もたれと座面の穏やかな角度、内側へ絞り込まれたベース、緻密に設計された高低差が身体を自然に支え、ゆったりとした姿勢へと導きます。"
          ],
          images: [
            {
              src: `${designShanghaiImageRoot}/ds2.jpg`,
              alt: "Design Shanghaiの会場で、吊り下げ展示されたWEIMOのラウンジチェアとWu Bin氏、ゲスト"
            },
            {
              src: `${designShanghaiImageRoot}/ds3.jpg`,
              alt: "WEIMOの家具展示について説明するデザイナーのWu Bin氏"
            },
            {
              src: `${designShanghaiImageRoot}/ds4.jpg`,
              alt: "Design Shanghai 2024で展示されたアルカンターラ張りの墨想ラウンジチェア"
            }
          ]
        },
        {
          title: "アルカンターラ × イリス・ヴァン・ヘルペン",
          body: [
            "もうひとつの見どころは、オランダを代表するデザイナー、イリス・ヴァン・ヘルペンによる彫刻的な作品です。アルカンターラを精緻な技術で形づくったドレスは、来場者を仮想空間のような世界へと誘います。暗い空間の中で白いアルカンターラの繊細なラインが四方へ広がり、動き、光、素材が交差する没入感のあるシルエットを描き出しました。"
          ],
          images: [
            {
              src: `${designShanghaiImageRoot}/ds5.jpg`,
              alt: "Design Shanghaiで展示されたイリス・ヴァン・ヘルペンの彫刻的なアルカンターラドレス"
            },
            {
              src: `${designShanghaiImageRoot}/ds6.jpg`,
              alt: "イリス・ヴァン・ヘルペンのアルカンターラドレスを形づくる白いラインのディテール"
            }
          ]
        },
        {
          title: "アルカンターラ：無限の可能性",
          body: [
            "豊富なカラーパレットと実際に触れられるサンプルを通じて、来場者はコレクションの幅広さを間近で体感しました。色彩、仕上げ、加工技術の多様性から、インテリア、自動車、ファッション、さらにその先へと広がるアルカンターラの可能性を紹介しました。"
          ],
          images: [
            {
              src: `${designShanghaiImageRoot}/ds7.jpg`,
              alt: "インテリアと自動車用途のアルカンターラカラーサンプルを見る来場者"
            },
            {
              src: `${designShanghaiImageRoot}/ds8.jpg`,
              alt: "Design Shanghaiでアルカンターラのサンプルに触れる来場者"
            }
          ]
        }
      ]
    }
  },
  "alcantara-camari-third-strategic-chapter": {
    en: {
      dateline: "Milan, Italy / 15 April 2025",
      heroFormat: "portrait",
      introduction: [
        "On 15 April 2025, Alcantara and CAMARI signed their third five-year distribution agreement in Milan, Italy. CAMARI CEO Chenqi Yu and Alcantara S.p.A. CEO Eugenio Lolli attended the signing ceremony, marking the start of a new chapter in a partnership that now spans more than a decade.",
        "The renewed agreement reflects a shared commitment to developing the Alcantara business across Asia Pacific through material expertise, close market collaboration, and a long-term approach to customers and creative partners."
      ],
      video: {
        poster: `${alcantaraContractImageRoot}/hero.jpg`,
        src: `${alcantaraContractImageRoot}/video.mp4`,
        title: "Highlights from the Alcantara and CAMARI distribution agreement signing in Milan"
      },
      sections: [
        {
          title: "2015: The Partnership Begins",
          body: [
            "CAMARI was appointed Alcantara's exclusive distributor for Greater China, formally establishing the brand's commercial presence and market development programme across the region."
          ],
          images: []
        },
        {
          title: "2020: A Broader Asia Pacific Mandate",
          body: [
            "The partnership entered its second five-year term as CAMARI became Alcantara's exclusive distributor for Asia Pacific, extending the collaboration into a wider and increasingly diverse market."
          ],
          images: []
        },
        {
          title: "2025: A Third Five-Year Chapter",
          body: [
            "The latest agreement renews CAMARI's role as Alcantara's exclusive distributor for Asia Pacific for another five years. Together, the two companies will continue to deepen their regional presence and create new opportunities across interiors, mobility, fashion, and product design.",
            "From an ambitious vision to an internationally recognised material, Alcantara has built its reputation through uncompromising quality and a constant drive to explore what comes next. CAMARI looks forward to carrying that spirit forward across Asia Pacific, bringing the material's distinctive character and creative potential to an ever-growing community of clients and designers."
          ],
          images: []
        }
      ]
    },
    ja: {
      dateline: "イタリア・ミラノ / 2025年4月15日",
      heroFormat: "portrait",
      introduction: [
        "2025年4月15日、アルカンターラとカマリは、イタリア・ミラノにて3度目となる5カ年の販売代理店契約を締結しました。調印式には、カマリCEOの于臣琪（Chenqi Yu）とAlcantara S.p.A. CEOのEugenio Lolli（エウジェニオ・ロッリ）氏が出席。10年以上にわたる両社のパートナーシップは、新たな章を迎えます。",
        "今回の契約更新は、素材に関する専門知識、市場との緊密な連携、顧客やクリエイティブパートナーとの長期的な関係を軸に、アジア太平洋地域でアルカンターラの事業を発展させていくという両社の共通の姿勢を示すものです。"
      ],
      video: {
        poster: `${alcantaraContractImageRoot}/hero.jpg`,
        src: `${alcantaraContractImageRoot}/video.mp4`,
        title: "ミラノで行われたアルカンターラとカマリの販売代理店契約調印式"
      },
      sections: [
        {
          title: "2015年：パートナーシップの始まり",
          body: [
            "カマリは、アルカンターラの大中華圏における総代理店に就任。地域におけるブランドの事業基盤を築き、市場開拓を本格的に開始しました。"
          ],
          images: []
        },
        {
          title: "2020年：アジア太平洋へ",
          body: [
            "2期目となる5カ年契約を締結し、カマリはアルカンターラのアジア太平洋地域における総代理店に就任。両社の協業は、より広く多様な市場へと拡大しました。"
          ],
          images: []
        },
        {
          title: "2025年：新たな5年間へ",
          body: [
            "今回の契約により、カマリは引き続きアジア太平洋地域の総代理店を務めます。両社は今後も地域での事業基盤を深め、インテリア、モビリティ、ファッション、プロダクトデザインの各分野で新たな可能性を切り拓いていきます。",
            "ひとつの夢から、世界に認められる素材へ。アルカンターラは、妥協のない品質と、常に次の可能性を追求する姿勢によって、その価値を築いてきました。カマリはこの精神を受け継ぎ、アジア太平洋地域の顧客やデザイナーとともに、素材ならではの個性と創造性をさらに広げてまいります。"
          ],
          images: []
        }
      ]
    }
  },
  "camari-tokyo-auto-salon-2026": {
    en: {
      dateline: "Japan / 11 January 2026",
      heroFormat: "standard",
      heroImage: `${tokyoAutoSalonImageRoot}/herowologo.jpg?v=20260808`,
      introduction: [
        "CAMARI INTERNATIONAL JAPAN successfully concluded its first appearance at Tokyo Auto Salon on 11 January 2026, following three dynamic days of exhibitions, conversations, and new connections.",
        "Being able to participate in one of Japan's most prominent automotive events during our first year was both an honour and an important milestone for the company."
      ],
      sections: [
        {
          title: "Materials and OEM Manufacturing in One Place",
          body: [
            "At the CAMARI booth, visitors explored a broad selection of materials, including Alcantara® and carefully selected Italian leathers. We also presented a diverse range of OEM products developed with these materials, from automotive accessories to lifestyle items.",
            "The exhibition provided an opportunity to demonstrate more than the tactile quality and visual character of each material. Through finished products, visitors could experience CAMARI's wider capabilities across concept development, material selection, design, and manufacturing."
          ],
          images: []
        },
        {
          title: "Conversations That Open New Possibilities",
          body: [
            "Throughout the event, the CAMARI booth welcomed a large number of visitors from Japan and overseas. Guests were able to handle the products directly and experience their materials, finishes, and design details at close range.",
            "We also received many specific enquiries regarding OEM development and material applications, reflecting strong interest in CAMARI's products, services, and manufacturing expertise.",
            "CAMARI-developed products were also displayed and offered for sale at several partner booths across the venue. We were delighted that visitors could encounter our work not only at our own booth, but also through the brands and products of our business partners."
          ],
          images: [
            {
              aspectRatio: "4 / 3",
              featured: true,
              src: `${tokyoAutoSalonImageRoot}/display.jpg`,
              alt: "CAMARI's presentation of material colours and finished OEM products at Tokyo Auto Salon"
            },
            {
              aspectRatio: "3 / 4",
              src: `${tokyoAutoSalonImageRoot}/booth.jpeg`,
              alt: "Visitors exploring materials and speaking with the CAMARI team at Tokyo Auto Salon"
            },
            {
              aspectRatio: "3 / 4",
              src: `${tokyoAutoSalonImageRoot}/display2.jpg`,
              alt: "Alcantara samples, colour references, automotive accessories, and lifestyle products at the CAMARI booth"
            },
            {
              aspectRatio: "3 / 4",
              src: `${tokyoAutoSalonImageRoot}/hanging .jpg`,
              alt: "A colour display of Alcantara material samples at the CAMARI booth"
            }
          ]
        },
        {
          title: "Building on the Experience",
          body: [
            "Tokyo Auto Salon welcomed approximately 300,000 visitors over three days, creating an energetic atmosphere throughout the venue. The opportunity to speak directly with customers, partners, and industry professionals, while forming new relationships, made the event especially valuable for our team.",
            "The feedback and ideas gathered during the exhibition will inform our future product development and OEM activities. We will continue creating products that bring out the distinctive qualities of each material while delivering greater value through thoughtful design and manufacturing.",
            "CAMARI INTERNATIONAL JAPAN will continue to take on new manufacturing challenges across automotive, lifestyle, and other fields, helping customers turn their ideas into tangible products.",
            "We would like to express our sincere appreciation to everyone who visited the CAMARI booth, to our business partners who presented our products, and to the organisers and staff of Tokyo Auto Salon. We look forward to continuing our journey with you."
          ],
          images: [
            {
              aspectRatio: "3 / 2",
              src: `${tokyoAutoSalonImageRoot}/top.jpg`,
              alt: "An overhead view of the busy Tokyo Auto Salon exhibition halls"
            }
          ]
        }
      ]
    },
    ja: {
      dateline: "日本 / 2026年1月11日",
      heroFormat: "standard",
      heroImage: `${tokyoAutoSalonImageRoot}/herowologo.jpg?v=20260808`,
      introduction: [
        "カマリ・インターナショナル・ジャパンは、このたび「東京オートサロン」に初出展し、盛況のうちに3日間の会期を終えることができました。",
        "当社にとって初年度からこのような日本を代表する大規模な自動車イベントに出展する機会を得られたことを、大変光栄に感じております。"
      ],
      sections: [
        {
          title: "素材とOEM製品を一堂に展示",
          body: [
            "今回の当社ブースでは、Alcantara®（アルカンターラ）をはじめ、厳選されたイタリアンレザーなど、当社が取り扱うさまざまな素材をご紹介するとともに、それらの素材を活用したカー用品、ライフスタイル用品をはじめとする多彩なOEM製品を展示いたしました。",
            "素材そのものの質感や美しさだけでなく、企画・素材選定から製品化まで、幅広いニーズに対応できる当社のOEM・ものづくりの可能性を、実際の製品を通して多くの皆様にご覧いただく機会となりました。"
          ],
          images: []
        },
        {
          title: "国内外から多くの来場者",
          body: [
            "会期中は国内外から非常に多くのお客様に当社ブースへお越しいただき、展示製品を実際に手に取って、素材の質感や仕上がり、デザインなどをご体感いただきました。また、OEM製品や素材に関する具体的なご相談も数多くいただき、当社の製品・サービスに高い関心をお寄せいただきました。",
            "さらに、会場内のお取引先様のブースにおいても、当社が携わったさまざまな製品が展示・販売されました。当社ブースだけでなく、お取引先様のブランドや製品を通じても、多くの来場者の皆様に当社のものづくりに触れていただけたことを、大変嬉しく思っております。",
            "東京オートサロンは3日間を通して約30万人が来場する大規模なイベントとなり、会場は連日大きな賑わいを見せました。その中で、多くのお客様や関係者の皆様と直接お話しし、新たな出会いやご縁をいただけたことは、当社にとって非常に貴重な経験となりました。"
          ],
          images: [
            {
              aspectRatio: "4 / 3",
              featured: true,
              src: `${tokyoAutoSalonImageRoot}/display.jpg`,
              alt: "東京オートサロンで紹介したカマリの素材カラーとOEM製品"
            },
            {
              aspectRatio: "3 / 4",
              src: `${tokyoAutoSalonImageRoot}/booth.jpeg`,
              alt: "東京オートサロンのカマリブースで素材を手に取り、スタッフと話す来場者"
            },
            {
              aspectRatio: "3 / 4",
              src: `${tokyoAutoSalonImageRoot}/display2.jpg`,
              alt: "カマリブースに展示されたアルカンターラのサンプル、カラーバリエーション、カー用品、ライフスタイル製品"
            },
            {
              aspectRatio: "3 / 4",
              src: `${tokyoAutoSalonImageRoot}/hanging .jpg`,
              alt: "カマリブースに並ぶ色鮮やかなアルカンターラの素材サンプル"
            }
          ]
        },
        {
          title: "今後の製品開発とOEM事業へ",
          body: [
            "今回の出展を通じて得られた皆様からのご意見や新たなアイデアを今後の製品開発・OEM事業に活かし、素材の魅力を最大限に引き出した、より付加価値の高い製品づくりに取り組んでまいります。",
            "カマリ・インターナショナル・ジャパンは、これからも自動車関連製品にとどまらず、ライフスタイルを含むさまざまな分野において、お客様のアイデアを形にするものづくりに挑戦してまいります。",
            "会期中、当社ブースへお越しいただいた皆様、当社製品をお取り扱いいただいたお取引先の皆様、ならびに東京オートサロン関係者の皆様に、改めて心より御礼申し上げます。",
            "今後ともカマリ・インターナショナル・ジャパンをよろしくお願い申し上げます。"
          ],
          images: [
            {
              aspectRatio: "3 / 2",
              src: `${tokyoAutoSalonImageRoot}/top.jpg`,
              alt: "多くの来場者でにぎわう東京オートサロン会場の全景"
            }
          ]
        }
      ]
    }
  }
};

export function getNewsArticleContent(slug: string, locale: Locale): NewsArticleContent | undefined {
  return newsArticles[slug]?.[locale];
}
