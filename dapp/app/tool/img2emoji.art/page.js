"use client";

import { Context } from "@/providers/Providers";
import { Button, Input, Link, Slider } from "@nextui-org/react";
import { useState, useRef, useEffect, useContext } from "react";

const EmojiMosaic = () => {
  const { balances, userAddress } = useContext(Context);
  const [isClient, setIsClient] = useState(false);
  const [source, setSource] = useState(
    "😀,😃,😄,😁,😆,😅,🤣,😂,🙂,🙃,😉,😊,😇,🥰,😍,🤩,😘,😗,☺,😚,😙,🥲,😋,😛,😜,🤪,😝,🤑,🤗,🤭,🤫,🤔,🤐,🤨,😐,😑,😶,😶‍🌫️,😏,😒,🙄,😬,😮‍💨,🤥,😌,😔,😪,🤤,😴,😷,🤒,🤕,🤢,🤮,🤧,🥵,🥶,🥴,😵,😵‍💫,🤯,🤠,🥳,🥸,😎,🤓,🧐,😕,😟,🙁,☹,😮,😯,😲,😳,🥺,😦,😧,😨,😰,😥,😢,😭,😱,😖,😣,😞,😓,😩,😫,🥱,😤,😡,😠,🤬,😈,👿,💀,☠,💩,🤡,👹,👺,👻,👽,👾,🤖,😺,😸,😹,😻,😼,😽,🙀,😿,😾,🙈,🙉,🙊,💋,💌,💘,💝,💖,💗,💓,💞,💕,💟,❣,💔,❤️‍🔥,❤️‍🩹,❤,🧡,💛,💚,💙,💜,🤎,🖤,🤍,💯,💢,💥,💫,💦,💨,🕳,💣,💬,👁️‍🗨️,🗨,🗯,💭,💤,👋,🤚,🖐,✋,🖖,👌,🤌,🤏,✌,🤞,🤟,🤘,🤙,👈,👉,👆,🖕,👇,☝,👍,👎,✊,👊,🤛,🤜,👏,🙌,👐,🤲,🤝,🙏,✍,💅,🤳,💪,🦾,🦿,🦵,🦶,👂,🦻,👃,🧠,🫀,🫁,🦷,🦴,👀,👁,👅,👄,👶,🧒,👦,👧,🧑,👱,👨,🧔,🧔‍♂️,🧔‍♀️,👨‍🦰,👨‍🦱,👨‍🦳,👨‍🦲,👩,👩‍🦰,🧑‍🦰,👩‍🦱,🧑‍🦱,👩‍🦳,🧑‍🦳,👩‍🦲,🧑‍🦲,👱‍♀️,👱‍♂️,🧓,👴,👵,🙍,🙍‍♂️,🙍‍♀️,🙎,🙎‍♂️,🙎‍♀️,🙅,🙅‍♂️,🙅‍♀️,🙆,🙆‍♂️,🙆‍♀️,💁,💁‍♂️,💁‍♀️,🙋,🙋‍♂️,🙋‍♀️,🧏,🧏‍♂️,🧏‍♀️,🙇,🙇‍♂️,🙇‍♀️,🤦,🤦‍♂️,🤦‍♀️,🤷,🤷‍♂️,🤷‍♀️,🧑‍⚕️,👨‍⚕️,👩‍⚕️,🧑‍🎓,👨‍🎓,👩‍🎓,🧑‍🏫,👨‍🏫,👩‍🏫,🧑‍⚖️,👨‍⚖️,👩‍⚖️,🧑‍🌾,👨‍🌾,👩‍🌾,🧑‍🍳,👨‍🍳,👩‍🍳,🧑‍🔧,👨‍🔧,👩‍🔧,🧑‍🏭,👨‍🏭,👩‍🏭,🧑‍💼,👨‍💼,👩‍💼,🧑‍🔬,👨‍🔬,👩‍🔬,🧑‍💻,👨‍💻,👩‍💻,🧑‍🎤,👨‍🎤,👩‍🎤,🧑‍🎨,👨‍🎨,👩‍🎨,🧑‍✈️,👨‍✈️,👩‍✈️,🧑‍🚀,👨‍🚀,👩‍🚀,🧑‍🚒,👨‍🚒,👩‍🚒,👮,👮‍♂️,👮‍♀️,🕵,🕵️‍♂️,🕵️‍♀️,💂,💂‍♂️,💂‍♀️,🥷,👷,👷‍♂️,👷‍♀️,🤴,👸,👳,👳‍♂️,👳‍♀️,👲,🧕,🤵,🤵‍♂️,🤵‍♀️,👰,👰‍♂️,👰‍♀️,🤰,🤱,👩‍🍼,👨‍🍼,🧑‍🍼,👼,🎅,🤶,🧑‍🎄,🦸,🦸‍♂️,🦸‍♀️,🦹,🦹‍♂️,🦹‍♀️,🧙,🧙‍♂️,🧙‍♀️,🧚,🧚‍♂️,🧚‍♀️,🧛,🧛‍♂️,🧛‍♀️,🧜,🧜‍♂️,🧜‍♀️,🧝,🧝‍♂️,🧝‍♀️,🧞,🧞‍♂️,🧞‍♀️,🧟,🧟‍♂️,🧟‍♀️,💆,💆‍♂️,💆‍♀️,💇,💇‍♂️,💇‍♀️,🚶,🚶‍♂️,🚶‍♀️,🧍,🧍‍♂️,🧍‍♀️,🧎,🧎‍♂️,🧎‍♀️,🧑‍🦯,👨‍🦯,👩‍🦯,🧑‍🦼,👨‍🦼,👩‍🦼,🧑‍🦽,👨‍🦽,👩‍🦽,🏃,🏃‍♂️,🏃‍♀️,💃,🕺,🕴,👯,👯‍♂️,👯‍♀️,🧖,🧖‍♂️,🧖‍♀️,🧗,🧗‍♂️,🧗‍♀️,🤺,🏇,⛷,🏂,🏌,🏌️‍♂️,🏌️‍♀️,🏄,🏄‍♂️,🏄‍♀️,🚣,🚣‍♂️,🚣‍♀️,🏊,🏊‍♂️,🏊‍♀️,⛹,⛹️‍♂️,⛹️‍♀️,🏋,🏋️‍♂️,🏋️‍♀️,🚴,🚴‍♂️,🚴‍♀️,🚵,🚵‍♂️,🚵‍♀️,🤸,🤸‍♂️,🤸‍♀️,🤼,🤼‍♂️,🤼‍♀️,🤽,🤽‍♂️,🤽‍♀️,🤾,🤾‍♂️,🤾‍♀️,🤹,🤹‍♂️,🤹‍♀️,🧘,🧘‍♂️,🧘‍♀️,🛀,🛌,🧑‍🤝‍🧑,👭,👫,👬,💏,👩‍❤️‍💋‍👨,👨‍❤️‍💋‍👨,👩‍❤️‍💋‍👩,💑,👩‍❤️‍👨,👨‍❤️‍👨,👩‍❤️‍👩,👪,👨‍👩‍👦,👨‍👩‍👧,👨‍👩‍👧‍👦,👨‍👩‍👦‍👦,👨‍👩‍👧‍👧,👨‍👨‍👦,👨‍👨‍👧,👨‍👨‍👧‍👦,👨‍👨‍👦‍👦,👨‍👨‍👧‍👧,👩‍👩‍👦,👩‍👩‍👧,👩‍👩‍👧‍👦,👩‍👩‍👦‍👦,👩‍👩‍👧‍👧,👨‍👦,👨‍👦‍👦,👨‍👧,👨‍👧‍👦,👨‍👧‍👧,👩‍👦,👩‍👦‍👦,👩‍👧,👩‍👧‍👦,👩‍👧‍👧,🗣,👤,👥,🫂,👣,🦰,🦱,🦳,🦲,🐵,🐒,🦍,🦧,🐶,🐕,🦮,🐕‍🦺,🐩,🐺,🦊,🦝,🐱,🐈,🐈‍⬛,🦁,🐯,🐅,🐆,🐴,🐎,🦄,🦓,🦌,🦬,🐮,🐂,🐃,🐄,🐷,🐖,🐗,🐽,🐏,🐑,🐐,🐪,🐫,🦙,🦒,🐘,🦣,🦏,🦛,🐭,🐁,🐀,🐹,🐰,🐇,🐿,🦫,🦔,🦇,🐻,🐻‍❄️,🐨,🐼,🦥,🦦,🦨,🦘,🦡,🐾,🦃,🐔,🐓,🐣,🐤,🐥,🐦,🐧,🕊,🦅,🦆,🦢,🦉,🦤,🪶,🦩,🦚,🦜,🐸,🐊,🐢,🦎,🐍,🐲,🐉,🦕,🦖,🐳,🐋,🐬,🦭,🐟,🐠,🐡,🦈,🐙,🐚,🐌,🦋,🐛,🐜,🐝,🪲,🐞,🦗,🪳,🕷,🕸,🦂,🦟,🪰,🪱,🦠,💐,🌸,💮,🏵,🌹,🥀,🌺,🌻,🌼,🌷,🌱,🪴,🌲,🌳,🌴,🌵,🌾,🌿,☘,🍀,🍁,🍂,🍃,🍇,🍈,🍉,🍊,🍋,🍌,🍍,🥭,🍎,🍏,🍐,🍑,🍒,🍓,🫐,🥝,🍅,🫒,🥥,🥑,🍆,🥔,🥕,🌽,🌶,🫑,🥒,🥬,🥦,🧄,🧅,🍄,🥜,🌰,🍞,🥐,🥖,🫓,🥨,🥯,🥞,🧇,🧀,🍖,🍗,🥩,🥓,🍔,🍟,🍕,🌭,🥪,🌮,🌯,🫔,🥙,🧆,🥚,🍳,🥘,🍲,🫕,🥣,🥗,🍿,🧈,🧂,🥫,🍱,🍘,🍙,🍚,🍛,🍜,🍝,🍠,🍢,🍣,🍤,🍥,🥮,🍡,🥟,🥠,🥡,🦀,🦞,🦐,🦑,🦪,🍦,🍧,🍨,🍩,🍪,🎂,🍰,🧁,🥧,🍫,🍬,🍭,🍮,🍯,🍼,🥛,☕,🫖,🍵,🍶,🍾,🍷,🍸,🍹,🍺,🍻,🥂,🥃,🥤,🧋,🧃,🧉,🧊,🥢,🍽,🍴,🥄,🔪,🏺,🌍,🌎,🌏,🌐,🗺,🗾,🧭,🏔,⛰,🌋,🗻,🏕,🏖,🏜,🏝,🏞,🏟,🏛,🏗,🧱,🪨,🪵,🛖,🏘,🏚,🏠,🏡,🏢,🏣,🏤,🏥,🏦,🏨,🏩,🏪,🏫,🏬,🏭,🏯,🏰,💒,🗼,🗽,⛪,🕌,🛕,🕍,⛩,🕋,⛲,⛺,🌁,🌃,🏙,🌄,🌅,🌆,🌇,🌉,♨,🎠,🎡,🎢,💈,🎪,🚂,🚃,🚄,🚅,🚆,🚇,🚈,🚉,🚊,🚝,🚞,🚋,🚌,🚍,🚎,🚐,🚑,🚒,🚓,🚔,🚕,🚖,🚗,🚘,🚙,🛻,🚚,🚛,🚜,🏎,🏍,🛵,🦽,🦼,🛺,🚲,🛴,🛹,🛼,🚏,🛣,🛤,🛢,⛽,🚨,🚥,🚦,🛑,🚧,⚓,⛵,🛶,🚤,🛳,⛴,🛥,🚢,✈,🛩,🛫,🛬,🪂,💺,🚁,🚟,🚠,🚡,🛰,🚀,🛸,🛎,🧳,⌛,⏳,⌚,⏰,⏱,⏲,🕰,🕛,🕧,🕐,🕜,🕑,🕝,🕒,🕞,🕓,🕟,🕔,🕠,🕕,🕡,🕖,🕢,🕗,🕣,🕘,🕤,🕙,🕥,🕚,🕦,🌑,🌒,🌓,🌔,🌕,🌖,🌗,🌘,🌙,🌚,🌛,🌜,🌡,☀,🌝,🌞,🪐,⭐,🌟,🌠,🌌,☁,⛅,⛈,🌤,🌥,🌦,🌧,🌨,🌩,🌪,🌫,🌬,🌀,🌈,🌂,☂,☔,⛱,⚡,❄,☃,⛄,☄,🔥,💧,🌊,🎃,🎄,🎆,🎇,🧨,✨,🎈,🎉,🎊,🎋,🎍,🎎,🎏,🎐,🎑,🧧,🎀,🎁,🎗,🎟,🎫,🎖,🏆,🏅,🥇,🥈,🥉,⚽,⚾,🥎,🏀,🏐,🏈,🏉,🎾,🥏,🎳,🏏,🏑,🏒,🥍,🏓,🏸,🥊,🥋,🥅,⛳,⛸,🎣,🤿,🎽,🎿,🛷,🥌,🎯,🪀,🪁,🎱,🔮,🪄,🧿,🎮,🕹,🎰,🎲,🧩,🧸,🪅,🪆,♠,♥,♦,♣,♟,🃏,🀄,🎴,🎭,🖼,🎨,🧵,🪡,🧶,🪢,👓,🕶,🥽,🥼,🦺,👔,👕,👖,🧣,🧤,🧥,🧦,👗,👘,🥻,🩱,🩲,🩳,👙,👚,👛,👜,👝,🛍,🎒,🩴,👞,👟,🥾,🥿,👠,👡,🩰,👢,👑,👒,🎩,🎓,🧢,🪖,⛑,📿,💄,💍,💎,🔇,🔈,🔉,🔊,📢,📣,📯,🔔,🔕,🎼,🎵,🎶,🎙,🎚,🎛,🎤,🎧,📻,🎷,🪗,🎸,🎹,🎺,🎻,🪕,🥁,🪘,📱,📲,☎,📞,📟,📠,🔋,🔌,💻,🖥,🖨,⌨,🖱,🖲,💽,💾,💿,📀,🧮,🎥,🎞,📽,🎬,📺,📷,📸,📹,📼,🔍,🔎,🕯,💡,🔦,🏮,🪔,📔,📕,📖,📗,📘,📙,📚,📓,📒,📃,📜,📄,📰,🗞,📑,🔖,🏷,💰,🪙,💴,💵,💶,💷,💸,💳,🧾,💹,✉,📧,📨,📩,📤,📥,📦,📫,📪,📬,📭,📮,🗳,✏,✒,🖋,🖊,🖌,🖍,📝,💼,📁,📂,🗂,📅,📆,🗒,🗓,📇,📈,📉,📊,📋,📌,📍,📎,🖇,📏,📐,✂,🗃,🗄,🗑,🔒,🔓,🔏,🔐,🔑,🗝,🔨,🪓,⛏,⚒,🛠,🗡,⚔,🔫,🪃,🏹,🛡,🪚,🔧,🪛,🔩,⚙,🗜,⚖,🦯,🔗,⛓,🪝,🧰,🧲,🪜,⚗,🧪,🧫,🧬,🔬,🔭,📡,💉,🩸,💊,🩹,🩺,🚪,🛗,🪞,🪟,🛏,🛋,🪑,🚽,🪠,🚿,🛁,🪤,🪒,🧴,🧷,🧹,🧺,🧻,🪣,🧼,🪥,🧽,🧯,🛒,🚬,⚰,🪦,⚱,🗿,🪧,🏧,🚮,🚰,♿,🚹,🚺,🚻,🚼,🚾,🛂,🛃,🛄,🛅,⚠,🚸,⛔,🚫,🚳,🚭,🚯,🚱,🚷,📵,🔞,☢,☣,⬆,↗,➡,↘,⬇,↙,⬅,↖,↕,↔,↩,↪,⤴,⤵,🔃,🔄,🔙,🔚,🔛,🔜,🔝,🛐,⚛,🕉,✡,☸,☯,✝,☦,☪,☮,🕎,🔯,♈,♉,♊,♋,♌,♍,♎,♏,♐,♑,♒,♓,⛎,🔀,🔁,🔂,▶,⏩,⏭,⏯,◀,⏪,⏮,🔼,⏫,🔽,⏬,⏸,⏹,⏺,⏏,🎦,🔅,🔆,📶,📳,📴,♀,♂,⚧,✖,➕,➖,➗,♾,‼,⁉,❓,❔,❕,❗,〰,💱,💲,⚕,♻,⚜,🔱,📛,🔰,⭕,✅,☑,✔,❌,❎,➰,➿,〽,✳,✴,❇,©,®,™,#️⃣,*️⃣,0️⃣,1️⃣,2️⃣,3️⃣,4️⃣,5️⃣,6️⃣,7️⃣,8️⃣,9️⃣,🔟,🔠,🔡,🔢,🔣,🔤,🅰,🆎,🅱,🆑,🆒,🆓,ℹ,🆔,Ⓜ,🆕,🆖,🅾,🆗,🅿,🆘,🆙,🆚,🈁,🈂,🈷,🈶,🈯,🉐,🈹,🈚,🈲,🉑,🈸,🈴,🈳,㊗,㊙,🈺,🈵,🔴,🟠,🟡,🟢,🔵,🟣,🟤,⚫,⚪,🟥,🟧,🟨,🟩,🟦,🟪,🟫,⬛,⬜,◼,◻,◾,◽,▪,▫,🔶,🔷,🔸,🔹,🔺,🔻,💠,🔘,🔳,🔲,🏁,🚩,🎌,🏴,🏳,🏳️‍🌈,🏳️‍⚧️,🏴‍☠️,🏴󠁧󠁢󠁥󠁮󠁧󠁿,🏴󠁧󠁢󠁳󠁣󠁴󠁿,🏴󠁧󠁢󠁷󠁬󠁳󠁿,👋🏻,👋🏼,👋🏽,👋🏾,👋🏿,🤚🏻,🤚🏼,🤚🏽,🤚🏾,🤚🏿,🖐🏻,🖐🏼,🖐🏽,🖐🏾,🖐🏿,✋🏻,✋🏼,✋🏽,✋🏾,✋🏿,🖖🏻,🖖🏼,🖖🏽,🖖🏾,🖖🏿,👌🏻,👌🏼,👌🏽,👌🏾,👌🏿,🤌🏻,🤌🏼,🤌🏽,🤌🏾,🤌🏿,🤏🏻,🤏🏼,🤏🏽,🤏🏾,🤏🏿,✌🏻,✌🏼,✌🏽,✌🏾,✌🏿,🤞🏻,🤞🏼,🤞🏽,🤞🏾,🤞🏿,🤟🏻,🤟🏼,🤟🏽,🤟🏾,🤟🏿,🤘🏻,🤘🏼,🤘🏽,🤘🏾,🤘🏿,🤙🏻,🤙🏼,🤙🏽,🤙🏾,🤙🏿,👈🏻,👈🏼,👈🏽,👈🏾,👈🏿,👉🏻,👉🏼,👉🏽,👉🏾,👉🏿,👆🏻,👆🏼,👆🏽,👆🏾,👆🏿,🖕🏻,🖕🏼,🖕🏽,🖕🏾,🖕🏿,👇🏻,👇🏼,👇🏽,👇🏾,👇🏿,☝🏻,☝🏼,☝🏽,☝🏾,☝🏿,👍🏻,👍🏼,👍🏽,👍🏾,👍🏿,👎🏻,👎🏼,👎🏽,👎🏾,👎🏿,✊🏻,✊🏼,✊🏽,✊🏾,✊🏿,👊🏻,👊🏼,👊🏽,👊🏾,👊🏿,🤛🏻,🤛🏼,🤛🏽,🤛🏾,🤛🏿,🤜🏻,🤜🏼,🤜🏽,🤜🏾,🤜🏿,👏🏻,👏🏼,👏🏽,👏🏾,👏🏿,🙌🏻,🙌🏼,🙌🏽,🙌🏾,🙌🏿,👐🏻,👐🏼,👐🏽,👐🏾,👐🏿,🤲🏻,🤲🏼,🤲🏽,🤲🏾,🤲🏿,🙏🏻,🙏🏼,🙏🏽,🙏🏾,🙏🏿,✍🏻,✍🏼,✍🏽,✍🏾,✍🏿,💅🏻,💅🏼,💅🏽,💅🏾,💅🏿,🤳🏻,🤳🏼,🤳🏽,🤳🏾,🤳🏿,💪🏻,💪🏼,💪🏽,💪🏾,💪🏿,🦵🏻,🦵🏼,🦵🏽,🦵🏾,🦵🏿,🦶🏻,🦶🏼,🦶🏽,🦶🏾,🦶🏿,👂🏻,👂🏼,👂🏽,👂🏾,👂🏿,🦻🏻,🦻🏼,🦻🏽,🦻🏾,🦻🏿,👃🏻,👃🏼,👃🏽,👃🏾,👃🏿,👶🏻,👶🏼,👶🏽,👶🏾,👶🏿,🧒🏻,🧒🏼,🧒🏽,🧒🏾,🧒🏿,👦🏻,👦🏼,👦🏽,👦🏾,👦🏿,👧🏻,👧🏼,👧🏽,👧🏾,👧🏿,🧑🏻,🧑🏼,🧑🏽,🧑🏾,🧑🏿,👱🏻,👱🏼,👱🏽,👱🏾,👱🏿,👨🏻,👨🏼,👨🏽,👨🏾,👨🏿,🧔🏻,🧔🏼,🧔🏽,🧔🏾,🧔🏿,🧔🏻‍♂️,🧔🏼‍♂️,🧔🏽‍♂️,🧔🏾‍♂️,🧔🏿‍♂️,🧔🏻‍♀️,🧔🏼‍♀️,🧔🏽‍♀️,🧔🏾‍♀️,🧔🏿‍♀️,👨🏻‍🦰,👨🏼‍🦰,👨🏽‍🦰,👨🏾‍🦰,👨🏿‍🦰,👨🏻‍🦱,👨🏼‍🦱,👨🏽‍🦱,👨🏾‍🦱,👨🏿‍🦱,👨🏻‍🦳,👨🏼‍🦳,👨🏽‍🦳,👨🏾‍🦳,👨🏿‍🦳,👨🏻‍🦲,👨🏼‍🦲,👨🏽‍🦲,👨🏾‍🦲,👨🏿‍🦲,👩🏻,👩🏼,👩🏽,👩🏾,👩🏿,👩🏻‍🦰,👩🏼‍🦰,👩🏽‍🦰,👩🏾‍🦰,👩🏿‍🦰,🧑🏻‍🦰,🧑🏼‍🦰,🧑🏽‍🦰,🧑🏾‍🦰,🧑🏿‍🦰,👩🏻‍🦱,👩🏼‍🦱,👩🏽‍🦱,👩🏾‍🦱,👩🏿‍🦱,🧑🏻‍🦱,🧑🏼‍🦱,🧑🏽‍🦱,🧑🏾‍🦱,🧑🏿‍🦱,👩🏻‍🦳,👩🏼‍🦳,👩🏽‍🦳,👩🏾‍🦳,👩🏿‍🦳,🧑🏻‍🦳,🧑🏼‍🦳,🧑🏽‍🦳,🧑🏾‍🦳,🧑🏿‍🦳,👩🏻‍🦲,👩🏼‍🦲,👩🏽‍🦲,👩🏾‍🦲,👩🏿‍🦲,🧑🏻‍🦲,🧑🏼‍🦲,🧑🏽‍🦲,🧑🏾‍🦲,🧑🏿‍🦲,👱🏻‍♀️,👱🏼‍♀️,👱🏽‍♀️,👱🏾‍♀️,👱🏿‍♀️,👱🏻‍♂️,👱🏼‍♂️,👱🏽‍♂️,👱🏾‍♂️,👱🏿‍♂️,🧓🏻,🧓🏼,🧓🏽,🧓🏾,🧓🏿,👴🏻,👴🏼,👴🏽,👴🏾,👴🏿,👵🏻,👵🏼,👵🏽,👵🏾,👵🏿,🙍🏻,🙍🏼,🙍🏽,🙍🏾,🙍🏿,🙍🏻‍♂️,🙍🏼‍♂️,🙍🏽‍♂️,🙍🏾‍♂️,🙍🏿‍♂️,🙍🏻‍♀️,🙍🏼‍♀️,🙍🏽‍♀️,🙍🏾‍♀️,🙍🏿‍♀️,🙎🏻,🙎🏼,🙎🏽,🙎🏾,🙎🏿,🙎🏻‍♂️,🙎🏼‍♂️,🙎🏽‍♂️,🙎🏾‍♂️,🙎🏿‍♂️,🙎🏻‍♀️,🙎🏼‍♀️,🙎🏽‍♀️,🙎🏾‍♀️,🙎🏿‍♀️,🙅🏻,🙅🏼,🙅🏽,🙅🏾,🙅🏿,🙅🏻‍♂️,🙅🏼‍♂️,🙅🏽‍♂️,🙅🏾‍♂️,🙅🏿‍♂️,🙅🏻‍♀️,🙅🏼‍♀️,🙅🏽‍♀️,🙅🏾‍♀️,🙅🏿‍♀️,🙆🏻,🙆🏼,🙆🏽,🙆🏾,🙆🏿,🙆🏻‍♂️,🙆🏼‍♂️,🙆🏽‍♂️,🙆🏾‍♂️,🙆🏿‍♂️,🙆🏻‍♀️,🙆🏼‍♀️,🙆🏽‍♀️,🙆🏾‍♀️,🙆🏿‍♀️,💁🏻,💁🏼,💁🏽,💁🏾,💁🏿,💁🏻‍♂️,💁🏼‍♂️,💁🏽‍♂️,💁🏾‍♂️,💁🏿‍♂️,💁🏻‍♀️,💁🏼‍♀️,💁🏽‍♀️,💁🏾‍♀️,💁🏿‍♀️,🙋🏻,🙋🏼,🙋🏽,🙋🏾,🙋🏿,🙋🏻‍♂️,🙋🏼‍♂️,🙋🏽‍♂️,🙋🏾‍♂️,🙋🏿‍♂️,🙋🏻‍♀️,🙋🏼‍♀️,🙋🏽‍♀️,🙋🏾‍♀️,🙋🏿‍♀️,🧏🏻,🧏🏼,🧏🏽,🧏🏾,🧏🏿,🧏🏻‍♂️,🧏🏼‍♂️,🧏🏽‍♂️,🧏🏾‍♂️,🧏🏿‍♂️,🧏🏻‍♀️,🧏🏼‍♀️,🧏🏽‍♀️,🧏🏾‍♀️,🧏🏿‍♀️,🙇🏻,🙇🏼,🙇🏽,🙇🏾,🙇🏿,🙇🏻‍♂️,🙇🏼‍♂️,🙇🏽‍♂️,🙇🏾‍♂️,🙇🏿‍♂️,🙇🏻‍♀️,🙇🏼‍♀️,🙇🏽‍♀️,🙇🏾‍♀️,🙇🏿‍♀️,🤦🏻,🤦🏼,🤦🏽,🤦🏾,🤦🏿,🤦🏻‍♂️,🤦🏼‍♂️,🤦🏽‍♂️,🤦🏾‍♂️,🤦🏿‍♂️,🤦🏻‍♀️,🤦🏼‍♀️,🤦🏽‍♀️,🤦🏾‍♀️,🤦🏿‍♀️,🤷🏻,🤷🏼,🤷🏽,🤷🏾,🤷🏿,🤷🏻‍♂️,🤷🏼‍♂️,🤷🏽‍♂️,🤷🏾‍♂️,🤷🏿‍♂️,🤷🏻‍♀️,🤷🏼‍♀️,🤷🏽‍♀️,🤷🏾‍♀️,🤷🏿‍♀️,🧑🏻‍⚕️,🧑🏼‍⚕️,🧑🏽‍⚕️,🧑🏾‍⚕️,🧑🏿‍⚕️,👨🏻‍⚕️,👨🏼‍⚕️,👨🏽‍⚕️,👨🏾‍⚕️,👨🏿‍⚕️,👩🏻‍⚕️,👩🏼‍⚕️,👩🏽‍⚕️,👩🏾‍⚕️,👩🏿‍⚕️,🧑🏻‍🎓,🧑🏼‍🎓,🧑🏽‍🎓,🧑🏾‍🎓,🧑🏿‍🎓,👨🏻‍🎓,👨🏼‍🎓,👨🏽‍🎓,👨🏾‍🎓,👨🏿‍🎓,👩🏻‍🎓,👩🏼‍🎓,👩🏽‍🎓,👩🏾‍🎓,👩🏿‍🎓,🧑🏻‍🏫,🧑🏼‍🏫,🧑🏽‍🏫,🧑🏾‍🏫,🧑🏿‍🏫,👨🏻‍🏫,👨🏼‍🏫,👨🏽‍🏫,👨🏾‍🏫,👨🏿‍🏫,👩🏻‍🏫,👩🏼‍🏫,👩🏽‍🏫,👩🏾‍🏫,👩🏿‍🏫,🧑🏻‍⚖️,🧑🏼‍⚖️,🧑🏽‍⚖️,🧑🏾‍⚖️,🧑🏿‍⚖️,👨🏻‍⚖️,👨🏼‍⚖️,👨🏽‍⚖️,👨🏾‍⚖️,👨🏿‍⚖️,👩🏻‍⚖️,👩🏼‍⚖️,👩🏽‍⚖️,👩🏾‍⚖️,👩🏿‍⚖️,🧑🏻‍🌾,🧑🏼‍🌾,🧑🏽‍🌾,🧑🏾‍🌾,🧑🏿‍🌾,👨🏻‍🌾,👨🏼‍🌾,👨🏽‍🌾,👨🏾‍🌾,👨🏿‍🌾,👩🏻‍🌾,👩🏼‍🌾,👩🏽‍🌾,👩🏾‍🌾,👩🏿‍🌾,🧑🏻‍🍳,🧑🏼‍🍳,🧑🏽‍🍳,🧑🏾‍🍳,🧑🏿‍🍳,👨🏻‍🍳,👨🏼‍🍳,👨🏽‍🍳,👨🏾‍🍳,👨🏿‍🍳,👩🏻‍🍳,👩🏼‍🍳,👩🏽‍🍳,👩🏾‍🍳,👩🏿‍🍳,🧑🏻‍🔧,🧑🏼‍🔧,🧑🏽‍🔧,🧑🏾‍🔧,🧑🏿‍🔧,👨🏻‍🔧,👨🏼‍🔧,👨🏽‍🔧,👨🏾‍🔧,👨🏿‍🔧,👩🏻‍🔧,👩🏼‍🔧,👩🏽‍🔧,👩🏾‍🔧,👩🏿‍🔧,🧑🏻‍🏭,🧑🏼‍🏭,🧑🏽‍🏭,🧑🏾‍🏭,🧑🏿‍🏭,👨🏻‍🏭,👨🏼‍🏭,👨🏽‍🏭,👨🏾‍🏭,👨🏿‍🏭,👩🏻‍🏭,👩🏼‍🏭,👩🏽‍🏭,👩🏾‍🏭,👩🏿‍🏭,🧑🏻‍💼,🧑🏼‍💼,🧑🏽‍💼,🧑🏾‍💼,🧑🏿‍💼,👨🏻‍💼,👨🏼‍💼,👨🏽‍💼,👨🏾‍💼,👨🏿‍💼,👩🏻‍💼,👩🏼‍💼,👩🏽‍💼,👩🏾‍💼,👩🏿‍💼,🧑🏻‍🔬,🧑🏼‍🔬,🧑🏽‍🔬,🧑🏾‍🔬,🧑🏿‍🔬,👨🏻‍🔬,👨🏼‍🔬,👨🏽‍🔬,👨🏾‍🔬,👨🏿‍🔬,👩🏻‍🔬,👩🏼‍🔬,👩🏽‍🔬,👩🏾‍🔬,👩🏿‍🔬,🧑🏻‍💻,🧑🏼‍💻,🧑🏽‍💻,🧑🏾‍💻,🧑🏿‍💻,👨🏻‍💻,👨🏼‍💻,👨🏽‍💻,👨🏾‍💻,👨🏿‍💻,👩🏻‍💻,👩🏼‍💻,👩🏽‍💻,👩🏾‍💻,👩🏿‍💻,🧑🏻‍🎤,🧑🏼‍🎤,🧑🏽‍🎤,🧑🏾‍🎤,🧑🏿‍🎤,👨🏻‍🎤,👨🏼‍🎤,👨🏽‍🎤,👨🏾‍🎤,👨🏿‍🎤,👩🏻‍🎤,👩🏼‍🎤,👩🏽‍🎤,👩🏾‍🎤,👩🏿‍🎤,🧑🏻‍🎨,🧑🏼‍🎨,🧑🏽‍🎨,🧑🏾‍🎨,🧑🏿‍🎨,👨🏻‍🎨,👨🏼‍🎨,👨🏽‍🎨,👨🏾‍🎨,👨🏿‍🎨,👩🏻‍🎨,👩🏼‍🎨,👩🏽‍🎨,👩🏾‍🎨,👩🏿‍🎨,🧑🏻‍✈️,🧑🏼‍✈️,🧑🏽‍✈️,🧑🏾‍✈️,🧑🏿‍✈️,👨🏻‍✈️,👨🏼‍✈️,👨🏽‍✈️,👨🏾‍✈️,👨🏿‍✈️,👩🏻‍✈️,👩🏼‍✈️,👩🏽‍✈️,👩🏾‍✈️,👩🏿‍✈️,🧑🏻‍🚀,🧑🏼‍🚀,🧑🏽‍🚀,🧑🏾‍🚀,🧑🏿‍🚀,👨🏻‍🚀,👨🏼‍🚀,👨🏽‍🚀,👨🏾‍🚀,👨🏿‍🚀,👩🏻‍🚀,👩🏼‍🚀,👩🏽‍🚀,👩🏾‍🚀,👩🏿‍🚀,🧑🏻‍🚒,🧑🏼‍🚒,🧑🏽‍🚒,🧑🏾‍🚒,🧑🏿‍🚒,👨🏻‍🚒,👨🏼‍🚒,👨🏽‍🚒,👨🏾‍🚒,👨🏿‍🚒,👩🏻‍🚒,👩🏼‍🚒,👩🏽‍🚒,👩🏾‍🚒,👩🏿‍🚒,👮🏻,👮🏼,👮🏽,👮🏾,👮🏿,👮🏻‍♂️,👮🏼‍♂️,👮🏽‍♂️,👮🏾‍♂️,👮🏿‍♂️,👮🏻‍♀️,👮🏼‍♀️,👮🏽‍♀️,👮🏾‍♀️,👮🏿‍♀️,🕵🏻,🕵🏼,🕵🏽,🕵🏾,🕵🏿,🕵🏻‍♂️,🕵🏼‍♂️,🕵🏽‍♂️,🕵🏾‍♂️,🕵🏿‍♂️,🕵🏻‍♀️,🕵🏼‍♀️,🕵🏽‍♀️,🕵🏾‍♀️,🕵🏿‍♀️,💂🏻,💂🏼,💂🏽,💂🏾,💂🏿,💂🏻‍♂️,💂🏼‍♂️,💂🏽‍♂️,💂🏾‍♂️,💂🏿‍♂️,💂🏻‍♀️,💂🏼‍♀️,💂🏽‍♀️,💂🏾‍♀️,💂🏿‍♀️,🥷🏻,🥷🏼,🥷🏽,🥷🏾,🥷🏿,👷🏻,👷🏼,👷🏽,👷🏾,👷🏿,👷🏻‍♂️,👷🏼‍♂️,👷🏽‍♂️,👷🏾‍♂️,👷🏿‍♂️,👷🏻‍♀️,👷🏼‍♀️,👷🏽‍♀️,👷🏾‍♀️,👷🏿‍♀️,🤴🏻,🤴🏼,🤴🏽,🤴🏾,🤴🏿,👸🏻,👸🏼,👸🏽,👸🏾,👸🏿,👳🏻,👳🏼,👳🏽,👳🏾,👳🏿,👳🏻‍♂️,👳🏼‍♂️,👳🏽‍♂️,👳🏾‍♂️,👳🏿‍♂️,👳🏻‍♀️,👳🏼‍♀️,👳🏽‍♀️,👳🏾‍♀️,👳🏿‍♀️,👲🏻,👲🏼,👲🏽,👲🏾,👲🏿,🧕🏻,🧕🏼,🧕🏽,🧕🏾,🧕🏿,🤵🏻,🤵🏼,🤵🏽,🤵🏾,🤵🏿,🤵🏻‍♂️,🤵🏼‍♂️,🤵🏽‍♂️,🤵🏾‍♂️,🤵🏿‍♂️,🤵🏻‍♀️,🤵🏼‍♀️,🤵🏽‍♀️,🤵🏾‍♀️,🤵🏿‍♀️,👰🏻,👰🏼,👰🏽,👰🏾,👰🏿,👰🏻‍♂️,👰🏼‍♂️,👰🏽‍♂️,👰🏾‍♂️,👰🏿‍♂️,👰🏻‍♀️,👰🏼‍♀️,👰🏽‍♀️,👰🏾‍♀️,👰🏿‍♀️,🤰🏻,🤰🏼,🤰🏽,🤰🏾,🤰🏿,🤱🏻,🤱🏼,🤱🏽,🤱🏾,🤱🏿,👩🏻‍🍼,👩🏼‍🍼,👩🏽‍🍼,👩🏾‍🍼,👩🏿‍🍼,👨🏻‍🍼,👨🏼‍🍼,👨🏽‍🍼,👨🏾‍🍼,👨🏿‍🍼,🧑🏻‍🍼,🧑🏼‍🍼,🧑🏽‍🍼,🧑🏾‍🍼,🧑🏿‍🍼,👼🏻,👼🏼,👼🏽,👼🏾,👼🏿,🎅🏻,🎅🏼,🎅🏽,🎅🏾,🎅🏿,🤶🏻,🤶🏼,🤶🏽,🤶🏾,🤶🏿,🧑🏻‍🎄,🧑🏼‍🎄,🧑🏽‍🎄,🧑🏾‍🎄,🧑🏿‍🎄,🦸🏻,🦸🏼,🦸🏽,🦸🏾,🦸🏿,🦸🏻‍♂️,🦸🏼‍♂️,🦸🏽‍♂️,🦸🏾‍♂️,🦸🏿‍♂️,🦸🏻‍♀️,🦸🏼‍♀️,🦸🏽‍♀️,🦸🏾‍♀️,🦸🏿‍♀️,🦹🏻,🦹🏼,🦹🏽,🦹🏾,🦹🏿,🦹🏻‍♂️,🦹🏼‍♂️,🦹🏽‍♂️,🦹🏾‍♂️,🦹🏿‍♂️,🦹🏻‍♀️,🦹🏼‍♀️,🦹🏽‍♀️,🦹🏾‍♀️,🦹🏿‍♀️,🧙🏻,🧙🏼,🧙🏽,🧙🏾,🧙🏿,🧙🏻‍♂️,🧙🏼‍♂️,🧙🏽‍♂️,🧙🏾‍♂️,🧙🏿‍♂️,🧙🏻‍♀️,🧙🏼‍♀️,🧙🏽‍♀️,🧙🏾‍♀️,🧙🏿‍♀️,🧚🏻,🧚🏼,🧚🏽,🧚🏾,🧚🏿,🧚🏻‍♂️,🧚🏼‍♂️,🧚🏽‍♂️,🧚🏾‍♂️,🧚🏿‍♂️,🧚🏻‍♀️,🧚🏼‍♀️,🧚🏽‍♀️,🧚🏾‍♀️,🧚🏿‍♀️,🧛🏻,🧛🏼,🧛🏽,🧛🏾,🧛🏿,🧛🏻‍♂️,🧛🏼‍♂️,🧛🏽‍♂️,🧛🏾‍♂️,🧛🏿‍♂️,🧛🏻‍♀️,🧛🏼‍♀️,🧛🏽‍♀️,🧛🏾‍♀️,🧛🏿‍♀️,🧜🏻,🧜🏼,🧜🏽,🧜🏾,🧜🏿,🧜🏻‍♂️,🧜🏼‍♂️,🧜🏽‍♂️,🧜🏾‍♂️,🧜🏿‍♂️,🧜🏻‍♀️,🧜🏼‍♀️,🧜🏽‍♀️,🧜🏾‍♀️,🧜🏿‍♀️,🧝🏻,🧝🏼,🧝🏽,🧝🏾,🧝🏿,🧝🏻‍♂️,🧝🏼‍♂️,🧝🏽‍♂️,🧝🏾‍♂️,🧝🏿‍♂️,🧝🏻‍♀️,🧝🏼‍♀️,🧝🏽‍♀️,🧝🏾‍♀️,🧝🏿‍♀️,💆🏻,💆🏼,💆🏽,💆🏾,💆🏿,💆🏻‍♂️,💆🏼‍♂️,💆🏽‍♂️,💆🏾‍♂️,💆🏿‍♂️,💆🏻‍♀️,💆🏼‍♀️,💆🏽‍♀️,💆🏾‍♀️,💆🏿‍♀️,💇🏻,💇🏼,💇🏽,💇🏾,💇🏿,💇🏻‍♂️,💇🏼‍♂️,💇🏽‍♂️,💇🏾‍♂️,💇🏿‍♂️,💇🏻‍♀️,💇🏼‍♀️,💇🏽‍♀️,💇🏾‍♀️,💇🏿‍♀️,🚶🏻,🚶🏼,🚶🏽,🚶🏾,🚶🏿,🚶🏻‍♂️,🚶🏼‍♂️,🚶🏽‍♂️,🚶🏾‍♂️,🚶🏿‍♂️,🚶🏻‍♀️,🚶🏼‍♀️,🚶🏽‍♀️,🚶🏾‍♀️,🚶🏿‍♀️,🧍🏻,🧍🏼,🧍🏽,🧍🏾,🧍🏿,🧍🏻‍♂️,🧍🏼‍♂️,🧍🏽‍♂️,🧍🏾‍♂️,🧍🏿‍♂️,🧍🏻‍♀️,🧍🏼‍♀️,🧍🏽‍♀️,🧍🏾‍♀️,🧍🏿‍♀️,🧎🏻,🧎🏼,🧎🏽,🧎🏾,🧎🏿,🧎🏻‍♂️,🧎🏼‍♂️,🧎🏽‍♂️,🧎🏾‍♂️,🧎🏿‍♂️,🧎🏻‍♀️,🧎🏼‍♀️,🧎🏽‍♀️,🧎🏾‍♀️,🧎🏿‍♀️,🧑🏻‍🦯,🧑🏼‍🦯,🧑🏽‍🦯,🧑🏾‍🦯,🧑🏿‍🦯,👨🏻‍🦯,👨🏼‍🦯,👨🏽‍🦯,👨🏾‍🦯,👨🏿‍🦯,👩🏻‍🦯,👩🏼‍🦯,👩🏽‍🦯,👩🏾‍🦯,👩🏿‍🦯,🧑🏻‍🦼,🧑🏼‍🦼,🧑🏽‍🦼,🧑🏾‍🦼,🧑🏿‍🦼,👨🏻‍🦼,👨🏼‍🦼,👨🏽‍🦼,👨🏾‍🦼,👨🏿‍🦼,👩🏻‍🦼,👩🏼‍🦼,👩🏽‍🦼,👩🏾‍🦼,👩🏿‍🦼,🧑🏻‍🦽,🧑🏼‍🦽,🧑🏽‍🦽,🧑🏾‍🦽,🧑🏿‍🦽,👨🏻‍🦽,👨🏼‍🦽,👨🏽‍🦽,👨🏾‍🦽,👨🏿‍🦽,👩🏻‍🦽,👩🏼‍🦽,👩🏽‍🦽,👩🏾‍🦽,👩🏿‍🦽,🏃🏻,🏃🏼,🏃🏽,🏃🏾,🏃🏿,🏃🏻‍♂️,🏃🏼‍♂️,🏃🏽‍♂️,🏃🏾‍♂️,🏃🏿‍♂️,🏃🏻‍♀️,🏃🏼‍♀️,🏃🏽‍♀️,🏃🏾‍♀️,🏃🏿‍♀️,💃🏻,💃🏼,💃🏽,💃🏾,💃🏿,🕺🏻,🕺🏼,🕺🏽,🕺🏾,🕺🏿,🕴🏻,🕴🏼,🕴🏽,🕴🏾,🕴🏿,🧖🏻,🧖🏼,🧖🏽,🧖🏾,🧖🏿,🧖🏻‍♂️,🧖🏼‍♂️,🧖🏽‍♂️,🧖🏾‍♂️,🧖🏿‍♂️,🧖🏻‍♀️,🧖🏼‍♀️,🧖🏽‍♀️,🧖🏾‍♀️,🧖🏿‍♀️,🧗🏻,🧗🏼,🧗🏽,🧗🏾,🧗🏿,🧗🏻‍♂️,🧗🏼‍♂️,🧗🏽‍♂️,🧗🏾‍♂️,🧗🏿‍♂️,🧗🏻‍♀️,🧗🏼‍♀️,🧗🏽‍♀️,🧗🏾‍♀️,🧗🏿‍♀️,🏇🏻,🏇🏼,🏇🏽,🏇🏾,🏇🏿,🏂🏻,🏂🏼,🏂🏽,🏂🏾,🏂🏿,🏌🏻,🏌🏼,🏌🏽,🏌🏾,🏌🏿,🏌🏻‍♂️,🏌🏼‍♂️,🏌🏽‍♂️,🏌🏾‍♂️,🏌🏿‍♂️,🏌🏻‍♀️,🏌🏼‍♀️,🏌🏽‍♀️,🏌🏾‍♀️,🏌🏿‍♀️,🏄🏻,🏄🏼,🏄🏽,🏄🏾,🏄🏿,🏄🏻‍♂️,🏄🏼‍♂️,🏄🏽‍♂️,🏄🏾‍♂️,🏄🏿‍♂️,🏄🏻‍♀️,🏄🏼‍♀️,🏄🏽‍♀️,🏄🏾‍♀️,🏄🏿‍♀️,🚣🏻,🚣🏼,🚣🏽,🚣🏾,🚣🏿,🚣🏻‍♂️,🚣🏼‍♂️,🚣🏽‍♂️,🚣🏾‍♂️,🚣🏿‍♂️,🚣🏻‍♀️,🚣🏼‍♀️,🚣🏽‍♀️,🚣🏾‍♀️,🚣🏿‍♀️,🏊🏻,🏊🏼,🏊🏽,🏊🏾,🏊🏿,🏊🏻‍♂️,🏊🏼‍♂️,🏊🏽‍♂️,🏊🏾‍♂️,🏊🏿‍♂️,🏊🏻‍♀️,🏊🏼‍♀️,🏊🏽‍♀️,🏊🏾‍♀️,🏊🏿‍♀️,⛹🏻,⛹🏼,⛹🏽,⛹🏾,⛹🏿,⛹🏻‍♂️,⛹🏼‍♂️,⛹🏽‍♂️,⛹🏾‍♂️,⛹🏿‍♂️,⛹🏻‍♀️,⛹🏼‍♀️,⛹🏽‍♀️,⛹🏾‍♀️,⛹🏿‍♀️,🏋🏻,🏋🏼,🏋🏽,🏋🏾,🏋🏿,🏋🏻‍♂️,🏋🏼‍♂️,🏋🏽‍♂️,🏋🏾‍♂️,🏋🏿‍♂️,🏋🏻‍♀️,🏋🏼‍♀️,🏋🏽‍♀️,🏋🏾‍♀️,🏋🏿‍♀️,🚴🏻,🚴🏼,🚴🏽,🚴🏾,🚴🏿,🚴🏻‍♂️,🚴🏼‍♂️,🚴🏽‍♂️,🚴🏾‍♂️,🚴🏿‍♂️,🚴🏻‍♀️,🚴🏼‍♀️,🚴🏽‍♀️,🚴🏾‍♀️,🚴🏿‍♀️,🚵🏻,🚵🏼,🚵🏽,🚵🏾,🚵🏿,🚵🏻‍♂️,🚵🏼‍♂️,🚵🏽‍♂️,🚵🏾‍♂️,🚵🏿‍♂️,🚵🏻‍♀️,🚵🏼‍♀️,🚵🏽‍♀️,🚵🏾‍♀️,🚵🏿‍♀️,🤸🏻,🤸🏼,🤸🏽,🤸🏾,🤸🏿,🤸🏻‍♂️,🤸🏼‍♂️,🤸🏽‍♂️,🤸🏾‍♂️,🤸🏿‍♂️,🤸🏻‍♀️,🤸🏼‍♀️,🤸🏽‍♀️,🤸🏾‍♀️,🤸🏿‍♀️,🤽🏻,🤽🏼,🤽🏽,🤽🏾,🤽🏿,🤽🏻‍♂️,🤽🏼‍♂️,🤽🏽‍♂️,🤽🏾‍♂️,🤽🏿‍♂️,🤽🏻‍♀️,🤽🏼‍♀️,🤽🏽‍♀️,🤽🏾‍♀️,🤽🏿‍♀️,🤾🏻,🤾🏼,🤾🏽,🤾🏾,🤾🏿,🤾🏻‍♂️,🤾🏼‍♂️,🤾🏽‍♂️,🤾🏾‍♂️,🤾🏿‍♂️,🤾🏻‍♀️,🤾🏼‍♀️,🤾🏽‍♀️,🤾🏾‍♀️,🤾🏿‍♀️,🤹🏻,🤹🏼,🤹🏽,🤹🏾,🤹🏿,🤹🏻‍♂️,🤹🏼‍♂️,🤹🏽‍♂️,🤹🏾‍♂️,🤹🏿‍♂️,🤹🏻‍♀️,🤹🏼‍♀️,🤹🏽‍♀️,🤹🏾‍♀️,🤹🏿‍♀️,🧘🏻,🧘🏼,🧘🏽,🧘🏾,🧘🏿,🧘🏻‍♂️,🧘🏼‍♂️,🧘🏽‍♂️,🧘🏾‍♂️,🧘🏿‍♂️,🧘🏻‍♀️,🧘🏼‍♀️,🧘🏽‍♀️,🧘🏾‍♀️,🧘🏿‍♀️,🛀🏻,🛀🏼,🛀🏽,🛀🏾,🛀🏿,🛌🏻,🛌🏼,🛌🏽,🛌🏾,🛌🏿,🧑🏻‍🤝‍🧑🏻,🧑🏻‍🤝‍🧑🏼,🧑🏻‍🤝‍🧑🏽,🧑🏻‍🤝‍🧑🏾,🧑🏻‍🤝‍🧑🏿,🧑🏼‍🤝‍🧑🏻,🧑🏼‍🤝‍🧑🏼,🧑🏼‍🤝‍🧑🏽,🧑🏼‍🤝‍🧑🏾,🧑🏼‍🤝‍🧑🏿,🧑🏽‍🤝‍🧑🏻,🧑🏽‍🤝‍🧑🏼,🧑🏽‍🤝‍🧑🏽,🧑🏽‍🤝‍🧑🏾,🧑🏽‍🤝‍🧑🏿,🧑🏾‍🤝‍🧑🏻,🧑🏾‍🤝‍🧑🏼,🧑🏾‍🤝‍🧑🏽,🧑🏾‍🤝‍🧑🏾,🧑🏾‍🤝‍🧑🏿,🧑🏿‍🤝‍🧑🏻,🧑🏿‍🤝‍🧑🏼,🧑🏿‍🤝‍🧑🏽,🧑🏿‍🤝‍🧑🏾,🧑🏿‍🤝‍🧑🏿,👭🏻,👩🏻‍🤝‍👩🏼,👩🏻‍🤝‍👩🏽,👩🏻‍🤝‍👩🏾,👩🏻‍🤝‍👩🏿,👩🏼‍🤝‍👩🏻,👭🏼,👩🏼‍🤝‍👩🏽,👩🏼‍🤝‍👩🏾,👩🏼‍🤝‍👩🏿,👩🏽‍🤝‍👩🏻,👩🏽‍🤝‍👩🏼,👭🏽,👩🏽‍🤝‍👩🏾,👩🏽‍🤝‍👩🏿,👩🏾‍🤝‍👩🏻,👩🏾‍🤝‍👩🏼,👩🏾‍🤝‍👩🏽,👭🏾,👩🏾‍🤝‍👩🏿,👩🏿‍🤝‍👩🏻,👩🏿‍🤝‍👩🏼,👩🏿‍🤝‍👩🏽,👩🏿‍🤝‍👩🏾,👭🏿,👫🏻,👩🏻‍🤝‍👨🏼,👩🏻‍🤝‍👨🏽,👩🏻‍🤝‍👨🏾,👩🏻‍🤝‍👨🏿,👩🏼‍🤝‍👨🏻,👫🏼,👩🏼‍🤝‍👨🏽,👩🏼‍🤝‍👨🏾,👩🏼‍🤝‍👨🏿,👩🏽‍🤝‍👨🏻,👩🏽‍🤝‍👨🏼,👫🏽,👩🏽‍🤝‍👨🏾,👩🏽‍🤝‍👨🏿,👩🏾‍🤝‍👨🏻,👩🏾‍🤝‍👨🏼,👩🏾‍🤝‍👨🏽,👫🏾,👩🏾‍🤝‍👨🏿,👩🏿‍🤝‍👨🏻,👩🏿‍🤝‍👨🏼,👩🏿‍🤝‍👨🏽,👩🏿‍🤝‍👨🏾,👫🏿,👬🏻,👨🏻‍🤝‍👨🏼,👨🏻‍🤝‍👨🏽,👨🏻‍🤝‍👨🏾,👨🏻‍🤝‍👨🏿,👨🏼‍🤝‍👨🏻,👬🏼,👨🏼‍🤝‍👨🏽,👨🏼‍🤝‍👨🏾,👨🏼‍🤝‍👨🏿,👨🏽‍🤝‍👨🏻,👨🏽‍🤝‍👨🏼,👬🏽,👨🏽‍🤝‍👨🏾,👨🏽‍🤝‍👨🏿,👨🏾‍🤝‍👨🏻,👨🏾‍🤝‍👨🏼,👨🏾‍🤝‍👨🏽,👬🏾,👨🏾‍🤝‍👨🏿,👨🏿‍🤝‍👨🏻,👨🏿‍🤝‍👨🏼,👨🏿‍🤝‍👨🏽,👨🏿‍🤝‍👨🏾,👬🏿,💏🏻,💏🏼,💏🏽,💏🏾,💏🏿,🧑🏻‍❤️‍💋‍🧑🏼,🧑🏻‍❤️‍💋‍🧑🏽,🧑🏻‍❤️‍💋‍🧑🏾,🧑🏻‍❤️‍💋‍🧑🏿,🧑🏼‍❤️‍💋‍🧑🏻,🧑🏼‍❤️‍💋‍🧑🏽,🧑🏼‍❤️‍💋‍🧑🏾,🧑🏼‍❤️‍💋‍🧑🏿,🧑🏽‍❤️‍💋‍🧑🏻,🧑🏽‍❤️‍💋‍🧑🏼,🧑🏽‍❤️‍💋‍🧑🏾,🧑🏽‍❤️‍💋‍🧑🏿,🧑🏾‍❤️‍💋‍🧑🏻,🧑🏾‍❤️‍💋‍🧑🏼,🧑🏾‍❤️‍💋‍🧑🏽,🧑🏾‍❤️‍💋‍🧑🏿,🧑🏿‍❤️‍💋‍🧑🏻,🧑🏿‍❤️‍💋‍🧑🏼,🧑🏿‍❤️‍💋‍🧑🏽,🧑🏿‍❤️‍💋‍🧑🏾,👩🏻‍❤️‍💋‍👨🏻,👩🏻‍❤️‍💋‍👨🏼,👩🏻‍❤️‍💋‍👨🏽,👩🏻‍❤️‍💋‍👨🏾,👩🏻‍❤️‍💋‍👨🏿,👩🏼‍❤️‍💋‍👨🏻,👩🏼‍❤️‍💋‍👨🏼,👩🏼‍❤️‍💋‍👨🏽,👩🏼‍❤️‍💋‍👨🏾,👩🏼‍❤️‍💋‍👨🏿,👩🏽‍❤️‍💋‍👨🏻,👩🏽‍❤️‍💋‍👨🏼,👩🏽‍❤️‍💋‍👨🏽,👩🏽‍❤️‍💋‍👨🏾,👩🏽‍❤️‍💋‍👨🏿,👩🏾‍❤️‍💋‍👨🏻,👩🏾‍❤️‍💋‍👨🏼,👩🏾‍❤️‍💋‍👨🏽,👩🏾‍❤️‍💋‍👨🏾,👩🏾‍❤️‍💋‍👨🏿,👩🏿‍❤️‍💋‍👨🏻,👩🏿‍❤️‍💋‍👨🏼,👩🏿‍❤️‍💋‍👨🏽,👩🏿‍❤️‍💋‍👨🏾,👩🏿‍❤️‍💋‍👨🏿,👨🏻‍❤️‍💋‍👨🏻,👨🏻‍❤️‍💋‍👨🏼,👨🏻‍❤️‍💋‍👨🏽,👨🏻‍❤️‍💋‍👨🏾,👨🏻‍❤️‍💋‍👨🏿,👨🏼‍❤️‍💋‍👨🏻,👨🏼‍❤️‍💋‍👨🏼,👨🏼‍❤️‍💋‍👨🏽,👨🏼‍❤️‍💋‍👨🏾,👨🏼‍❤️‍💋‍👨🏿,👨🏽‍❤️‍💋‍👨🏻,👨🏽‍❤️‍💋‍👨🏼,👨🏽‍❤️‍💋‍👨🏽,👨🏽‍❤️‍💋‍👨🏾,👨🏽‍❤️‍💋‍👨🏿,👨🏾‍❤️‍💋‍👨🏻,👨🏾‍❤️‍💋‍👨🏼,👨🏾‍❤️‍💋‍👨🏽,👨🏾‍❤️‍💋‍👨🏾,👨🏾‍❤️‍💋‍👨🏿,👨🏿‍❤️‍💋‍👨🏻,👨🏿‍❤️‍💋‍👨🏼,👨🏿‍❤️‍💋‍👨🏽,👨🏿‍❤️‍💋‍👨🏾,👨🏿‍❤️‍💋‍👨🏿,👩🏻‍❤️‍💋‍👩🏻,👩🏻‍❤️‍💋‍👩🏼,👩🏻‍❤️‍💋‍👩🏽,👩🏻‍❤️‍💋‍👩🏾,👩🏻‍❤️‍💋‍👩🏿,👩🏼‍❤️‍💋‍👩🏻,👩🏼‍❤️‍💋‍👩🏼,👩🏼‍❤️‍💋‍👩🏽,👩🏼‍❤️‍💋‍👩🏾,👩🏼‍❤️‍💋‍👩🏿,👩🏽‍❤️‍💋‍👩🏻,👩🏽‍❤️‍💋‍👩🏼,👩🏽‍❤️‍💋‍👩🏽,👩🏽‍❤️‍💋‍👩🏾,👩🏽‍❤️‍💋‍👩🏿,👩🏾‍❤️‍💋‍👩🏻,👩🏾‍❤️‍💋‍👩🏼,👩🏾‍❤️‍💋‍👩🏽,👩🏾‍❤️‍💋‍👩🏾,👩🏾‍❤️‍💋‍👩🏿,👩🏿‍❤️‍💋‍👩🏻,👩🏿‍❤️‍💋‍👩🏼,👩🏿‍❤️‍💋‍👩🏽,👩🏿‍❤️‍💋‍👩🏾,👩🏿‍❤️‍💋‍👩🏿,💑🏻,💑🏼,💑🏽,💑🏾,💑🏿,🧑🏻‍❤️‍🧑🏼,🧑🏻‍❤️‍🧑🏽,🧑🏻‍❤️‍🧑🏾,🧑🏻‍❤️‍🧑🏿,🧑🏼‍❤️‍🧑🏻,🧑🏼‍❤️‍🧑🏽,🧑🏼‍❤️‍🧑🏾,🧑🏼‍❤️‍🧑🏿,🧑🏽‍❤️‍🧑🏻,🧑🏽‍❤️‍🧑🏼,🧑🏽‍❤️‍🧑🏾,🧑🏽‍❤️‍🧑🏿,🧑🏾‍❤️‍🧑🏻,🧑🏾‍❤️‍🧑🏼,🧑🏾‍❤️‍🧑🏽,🧑🏾‍❤️‍🧑🏿,🧑🏿‍❤️‍🧑🏻,🧑🏿‍❤️‍🧑🏼,🧑🏿‍❤️‍🧑🏽,🧑🏿‍❤️‍🧑🏾,👩🏻‍❤️‍👨🏻,👩🏻‍❤️‍👨🏼,👩🏻‍❤️‍👨🏽,👩🏻‍❤️‍👨🏾,👩🏻‍❤️‍👨🏿,👩🏼‍❤️‍👨🏻,👩🏼‍❤️‍👨🏼,👩🏼‍❤️‍👨🏽,👩🏼‍❤️‍👨🏾,👩🏼‍❤️‍👨🏿,👩🏽‍❤️‍👨🏻,👩🏽‍❤️‍👨🏼,👩🏽‍❤️‍👨🏽,👩🏽‍❤️‍👨🏾,👩🏽‍❤️‍👨🏿,👩🏾‍❤️‍👨🏻,👩🏾‍❤️‍👨🏼,👩🏾‍❤️‍👨🏽,👩🏾‍❤️‍👨🏾,👩🏾‍❤️‍👨🏿,👩🏿‍❤️‍👨🏻,👩🏿‍❤️‍👨🏼,👩🏿‍❤️‍👨🏽,👩🏿‍❤️‍👨🏾,👩🏿‍❤️‍👨🏿,👨🏻‍❤️‍👨🏻,👨🏻‍❤️‍👨🏼,👨🏻‍❤️‍👨🏽,👨🏻‍❤️‍👨🏾,👨🏻‍❤️‍👨🏿,👨🏼‍❤️‍👨🏻,👨🏼‍❤️‍👨🏼,👨🏼‍❤️‍👨🏽,👨🏼‍❤️‍👨🏾,👨🏼‍❤️‍👨🏿,👨🏽‍❤️‍👨🏻,👨🏽‍❤️‍👨🏼,👨🏽‍❤️‍👨🏽,👨🏽‍❤️‍👨🏾,👨🏽‍❤️‍👨🏿,👨🏾‍❤️‍👨🏻,👨🏾‍❤️‍👨🏼,👨🏾‍❤️‍👨🏽,👨🏾‍❤️‍👨🏾,👨🏾‍❤️‍👨🏿,👨🏿‍❤️‍👨🏻,👨🏿‍❤️‍👨🏼,👨🏿‍❤️‍👨🏽,👨🏿‍❤️‍👨🏾,👨🏿‍❤️‍👨🏿,👩🏻‍❤️‍👩🏻,👩🏻‍❤️‍👩🏼,👩🏻‍❤️‍👩🏽,👩🏻‍❤️‍👩🏾,👩🏻‍❤️‍👩🏿,👩🏼‍❤️‍👩🏻,👩🏼‍❤️‍👩🏼,👩🏼‍❤️‍👩🏽,👩🏼‍❤️‍👩🏾,👩🏼‍❤️‍👩🏿,👩🏽‍❤️‍👩🏻,👩🏽‍❤️‍👩🏼,👩🏽‍❤️‍👩🏽,👩🏽‍❤️‍👩🏾,👩🏽‍❤️‍👩🏿,👩🏾‍❤️‍👩🏻,👩🏾‍❤️‍👩🏼,👩🏾‍❤️‍👩🏽,👩🏾‍❤️‍👩🏾,👩🏾‍❤️‍👩🏿,👩🏿‍❤️‍👩🏻,👩🏿‍❤️‍👩🏼,👩🏿‍❤️‍👩🏽,👩🏿‍❤️‍👩🏾,👩🏿‍❤️‍👩🏿"
  ); // Simplified for demonstration
  const [emojis, setEmojis] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [svgImage, setSvgImage] = useState("");
  const [scaleFactor, setScaleFactor] = useState(1);
  const canvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const imageRef = useRef(null); // Use useRef to store reference to the image element
  const [originalImage, setOriginalImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        // Store the original image data URL
        setOriginalImage(img.src);

        // Initial processing with the default scaleFactor
        processImage(img);
      };
    }
  };

  const pSize = useRef(7);
  const scale = useRef(12);
  const tolerance = useRef(8);
  const fillColor = useRef("#FFFFFF");
  const display = useRef("mosaic");
  const hideBlack = useRef(false);
  const emptySpace = useRef(0.7);
  const enableBgColor = useRef(false);
  const bgColor = useRef("#000000");

  useEffect(() => {
    setIsClient(true); // Indicates that the component is mounted
  }, []);

  useEffect(() => {
    if (isClient) {
      buildEmojiMap();
    }
  }, [isClient]);

  useEffect(() => {
    if (imageFile && isClient) {
      main();
    }
  }, [imageFile, isClient]);

  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setImageFile(URL.createObjectURL(e.target.files[0]));
  //   }
  // };

  useEffect(() => {
    if (originalImage && isClient) {
      // Re-process the image whenever scaleFactor changes
      const img = new Image();
      img.src = originalImage;
      img.onload = () => processImage(img);
    }
  }, [originalImage, isClient, scaleFactor]);

  const processImage = (img) => {
    // Calculate aspect ratio
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    // Resize to 512px on the larger dimension, maintaining aspect ratio
    let canvasWidth, canvasHeight;
    if (img.naturalWidth > img.naturalHeight) {
      canvasWidth = 512;
      canvasHeight = 512 / aspectRatio;
    } else {
      canvasWidth = 512 * aspectRatio;
      canvasHeight = 512;
    }

    // Apply scaleFactor to both width and height
    canvasWidth *= scaleFactor;
    canvasHeight *= scaleFactor;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    const resizedDataURL = canvas.toDataURL();
    setImageFile(resizedDataURL);
  };

  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];

  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);

  //     img.onload = () => {
  //       // Calculate aspect ratio
  //       const aspectRatio = img.naturalWidth / img.naturalHeight;

  //       // Resize to 512px on the larger dimension, maintaining aspect ratio
  //       let canvasWidth, canvasHeight;
  //       if (img.naturalWidth > img.naturalHeight) {
  //         canvasWidth = 512;
  //         canvasHeight = 512 / aspectRatio;
  //       } else {
  //         canvasWidth = 512 * aspectRatio;
  //         canvasHeight = 512;
  //       }

  //       // Apply scaleFactor to both width and height
  //       canvasWidth *= scaleFactor;
  //       canvasHeight *= scaleFactor;

  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");
  //       canvas.width = canvasWidth;
  //       canvas.height = canvasHeight;
  //       ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  //       const resizedDataURL = canvas.toDataURL();
  //       setImageFile(resizedDataURL);
  //     };
  //   }
  // };

  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];

  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);

  //     img.onload = () => {
  //       // Calculate the number of rows and columns based on pixelSize
  //       const ROWS = Math.floor(img.naturalHeight / pixelSize);
  //       const COLS = Math.floor(img.naturalWidth / pixelSize);

  //       // Calculate canvas dimensions to maintain aspect ratio and have square pixels
  //       const canvasWidth = COLS * pixelSize;
  //       const canvasHeight = ROWS * pixelSize;

  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");
  //       canvas.width = canvasWidth;
  //       canvas.height = canvasHeight;
  //       ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

  //       const resizedDataURL = canvas.toDataURL();
  //       setImageFile(resizedDataURL);
  //     };
  //   }
  // };

  const buildEmojiMap = () => {
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvasRef.current = hiddenCanvas;
    const hiddenContext = hiddenCanvas.getContext("2d");
    hiddenCanvas.height = 10;
    hiddenCanvas.width = 10;
    hiddenContext.font =
      "10px Segoe UI Emoji, Apple Color Emoji, Segoe UI Symbol, Noto Color Emoji";

    let emojisArr = source.split(",");
    emojisArr = emojisArr.map((e) => ({ key: e }));

    emojisArr.forEach((emo) => {
      hiddenContext.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
      hiddenContext.fillText(emo.key, 0, 10 / 1.4);
      let imageData = hiddenContext.getImageData(
        0,
        0,
        hiddenCanvas.width,
        hiddenCanvas.height
      );
      let colorInfo = getColorInfo(imageData.data);
      emo.rgb = colorInfo.rgb;
      emo.lab = colorInfo.lab;
      emo.isSupported = true;
    });

    setEmojis(emojisArr.filter((emo) => emo.isSupported));
  };

  const main = () => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageRef.current = img; // Assign to imageRef.current after img is loaded
      analyzeImage(img);
    };
    img.src = imageFile;
  };

  const analyzeImage = async (img) => {
    const hiddenCanvas = hiddenCanvasRef.current;
    const hiddenContext = hiddenCanvas.getContext("2d");
    hiddenCanvas.width = img.naturalWidth;
    hiddenCanvas.height = img.naturalHeight;
    hiddenContext.drawImage(img, 0, 0);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const ROWS = Math.floor(img.naturalHeight / pSize.current);
    const COLS = Math.floor(img.naturalWidth / pSize.current);

    const scaleFactor = 1; // Adjust this factor as needed
    const scaledWidth = COLS * scale.current * scaleFactor;
    const scaledHeight =
      ROWS * scale.current * scaleFactor - scale.current * scaleFactor;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (enableBgColor.current) {
      context.fillStyle = bgColor.current;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Scale the font size to match the increased resolution
    context.font = `${
      scale.current * scaleFactor
    }px Segoe UI Emoji, Apple Color Emoji, Segoe UI Symbol, Noto Color Emoji`;

    const hueMap = {};
    const pixels = [];
    for (let i = 0; i < ROWS * COLS; i++) {
      let row = Math.floor(i / COLS);
      let col = i % COLS;
      let buffer = hiddenContext.getImageData(
        col * pSize.current,
        row * pSize.current,
        pSize.current,
        pSize.current
      );
      let colorInfo = getColorInfo(buffer.data);
      let lightness = colorInfo.lab[0];

      let bestEmoji;
      if (!hueMap[lightness]) {
        let best = [];
        let toleranceValue = tolerance.current;
        while (best.length === 0) {
          best = emojis.filter(
            (e) => deltaE94(e.lab, colorInfo.lab) < toleranceValue
          );
          toleranceValue += Number(tolerance.current);
        }
        hueMap[lightness] = { emojis: best };
      }
      bestEmoji =
        hueMap[lightness].emojis[
          Math.floor(Math.random() * hueMap[lightness].emojis.length)
        ];

      let xc = scale.current * col;
      let yc = scale.current * row;
      pixels.push({ x: xc, y: yc, key: bestEmoji.key });

      if (i % 500 === 0) {
        await delay(0);
      }
    }

    pixels
      .sort(() => (Math.random() > 0.5 ? 1 : -1))
      .forEach((emo) => {
        context.fillText(emo.key, emo.x, emo.y);
      });

    // Generate SVG string
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000" viewBox="0 0 ${
      COLS * scale.current
    } ${ROWS * scale.current - scale.current}">`;

    if (enableBgColor.current) {
      svgString += `<rect width="100%" height="100%" fill="${bgColor.current}" />`;
    }

    pixels.forEach((emo) => {
      svgString += `<text x="${emo.x}" y="${emo.y}" font-size="11">${emo.key}</text>`;
    });

    svgString += "</svg>";

    // Convert SVG string to base64 data URL
    const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
    const dataURL = `data:image/svg+xml;base64,${base64Svg}`;

    // Set the data URL in your component's state or render it directly
    setSvgImage(dataURL);

    setCanvasReady(true);
  };

  const handleDownload = (fileType) => {
    if (fileType === "png") {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.href = url;
      a.download = "degeneratives-art.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (fileType === "svg") {
      const url = svgImage; // Use the svgImage data URL directly
      const a = document.createElement("a");
      a.href = url;
      a.download = "degeneratives-art.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-screen h-screen p-4 space-y-4 overflow-x-hidden">
      <nav className="flex items-center justify-center w-full p-4 md:justify-between bg-default-100 rounded-2xl">
        <Link href="/" className="flex items-center !text-foreground">
          <svg
            className="h-8"
            viewBox="0 0 35 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.1959 6.21804L20.7425 0.895891C19.7425 0.318403 18.413 0 16.9994 0C15.5861 0 14.2566 0.31802 13.2585 0.893978L3.92684 6.22187C1.76155 7.47099 0 10.36 0 12.6611V23.3131C0 25.6058 1.77341 28.494 3.95976 29.7554L13.4135 35.0775C14.4139 35.655 15.7433 35.9734 17.157 35.9734C18.5703 35.9734 19.8998 35.6554 20.8975 35.0794L30.2303 29.7516C32.3952 28.5021 34.1568 25.6138 34.1568 23.3131V12.6611C34.1564 10.3684 32.3826 7.47979 30.1959 6.21804ZM32.7029 23.3131C32.7029 25.0892 31.2081 27.5093 29.5066 28.4906L20.1738 33.8188C19.4019 34.2643 18.3021 34.5199 17.157 34.5199C16.0112 34.5199 14.9118 34.2643 14.1333 33.8146L4.67961 28.4925C2.9613 27.5009 1.45348 25.0804 1.45348 23.3131V12.6611C1.45348 10.885 2.94867 8.46409 4.65052 7.48286L13.9822 2.15458C14.7545 1.70912 15.8539 1.45348 16.9994 1.45348C18.1448 1.45348 19.2443 1.70912 20.0223 2.15879L29.476 7.48094C31.1951 8.47289 32.7029 10.8934 32.7029 12.6611V23.3131Z"
              fill="currentColor"
            />
            <path
              d="M16.9719 22.9528C16.1609 22.6975 15.3003 22.7741 14.5475 23.1679C12.9949 23.9788 12.3906 25.9026 13.2004 27.4568L14.0056 27.0373C13.4273 25.9271 13.8586 24.5521 14.9681 23.9731C16.0779 23.3929 17.4533 23.8254 18.0339 24.9359L18.8387 24.515C18.4449 23.7618 17.7824 23.2073 16.9719 22.9528Z"
              fill="currentColor"
            />
            <path
              d="M8.56216 18.8958C9.56568 18.8958 10.3792 18.0823 10.3792 17.0788C10.3792 16.0752 9.56568 15.2617 8.56216 15.2617C7.55863 15.2617 6.74512 16.0752 6.74512 17.0788C6.74512 18.0823 7.55863 18.8958 8.56216 18.8958Z"
              fill="currentColor"
            />
            <path
              d="M21.452 13.8322C19.772 15.5195 18.6288 16.5038 16.3973 15.5229L15.666 17.1857C16.5458 17.573 17.3296 17.7349 18.0372 17.7349C18.5707 17.7349 19.0594 17.6419 19.5125 17.4846C19.6966 18.2921 20.4157 18.8956 21.2798 18.8956C22.284 18.8956 23.0964 18.0828 23.0964 17.0786C23.0964 16.4471 22.7742 15.8918 22.2859 15.5665C22.4409 15.415 22.592 15.2635 22.7398 15.115C24.465 13.3821 25.6042 12.2367 28.3639 14.1869L29.4121 12.7028C25.4003 9.86858 23.2109 12.0664 21.452 13.8322Z"
              fill="currentColor"
            />
          </svg>
          <p className="px-3 text-lg font-semibold">
            img2emoji<span className="opacity-50">.art</span>
          </p>
        </Link>

        {canvasReady && (
          <div className="flex-col hidden space-y-2 md:flex md:flex-row md:space-x-2 md:space-y-0">
            <Button
              size="md"
              fullWidth
              radius="full"
              className="text-foreground bg-background"
              onClick={() => handleDownload("png")}
            >
              Download PNG
            </Button>
            <Button
              size="md"
              fullWidth
              radius="full"
              color="primary"
              onClick={() => handleDownload("svg")}
            >
              Download SVG
            </Button>
          </div>
        )}
      </nav>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center w-full min-h-40 bg-default-100 rounded-2xl">
          <label
            htmlFor="file"
            className="p-4 text-center cursor-pointer md:p-8"
          >
            <svg
              className="w-16 h-16 mx-auto"
              viewBox="-5 -5 24 24"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin"
            >
              <path
                fill="currentColor"
                d="M8 3.414v5.642a1 1 0 1 1-2 0V3.414L4.879 4.536A1 1 0 0 1 3.464 3.12L6.293.293a1 1 0 0 1 1.414 0l2.829 2.828A1 1 0 1 1 9.12 4.536zM1 12h12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2"
              />
            </svg>

            <p className="w-full text-background">
              Click to <span className="font-semibold">upload your image</span>{" "}
              or drop your image here
            </p>
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={handleImageChange}
            disabled={Number(balances.nft) < 5}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 bg-default-100 rounded-2xl">
          <div className="w-full ">
            {originalImage && (
              <div className="flex items-center justify-center w-full p-4 rounded-2xl">
                <img src={originalImage} alt="Original Image" className="" />
              </div>
            )}
          </div>
          <Slider
            size="sm"
            step={0.01}
            color="foreground"
            label="Scale Factor"
            value={scaleFactor}
            onChange={setScaleFactor}
            // showSteps={true}
            maxValue={2}
            minValue={0.05}
            defaultValue={1}
            className="max-w-md"
          />
        </div>
      </div>
      {Number(balances.nft) < 5 && userAddress && (
        <p className="w-full text-center lowercase text-danger animate-appearance-in">
          Ser, my apologies, but you need to hold at least 5 Degeneratives.art
          NFTs to access this exclusive tool.
        </p>
      )}
      <div className="grid w-full gap-3 md:grid-cols-2 ">
        <div className="relative w-full p-4 bg-default-100 rounded-2xl">
          <canvas ref={canvasRef} className="w-full"></canvas>
          <div className="absolute top-0 px-2 py-1 text-xs text-foreground bg-background drop-shadow-lg right-6">
            PNG
          </div>
        </div>

        <div className="relative w-full bg-default-100 rounded-2xl">
          <div className="w-full p-4">
            {" "}
            {canvasReady && <img src={svgImage} className="" />}
          </div>

          <div className="absolute top-0 px-2 py-1 text-xs bg-blue-600 text-foreground drop-shadow-lg right-6">
            SVG
          </div>
        </div>
      </div>

      {canvasReady && (
        <div className="flex flex-col space-y-2 md:hidden md:flex-row md:space-x-2 md:space-y-0">
          <Button
            size="md"
            fullWidth
            radius="full"
            className="text-foreground bg-background"
            onClick={() => handleDownload("png")}
          >
            Download PNG
          </Button>
          <Button
            size="md"
            fullWidth
            radius="full"
            color="primary"
            onClick={() => handleDownload("svg")}
          >
            Download SVG
          </Button>
        </div>
      )}
    </div>
  );
};

const getColorInfo = (arr) => {
  let sums = [0, 0, 0, 0, 0];
  let blockSize = 4;
  let totalColorPixels = 0;
  let totalPixels = 0;
  let transparentPixels = 0;

  for (let i = 0; i < arr.length; i += blockSize) {
    if (arr[i + 3] === 0) {
      transparentPixels++;
      continue;
    }
    sums[0] += arr[i] ** 2;
    sums[1] += arr[i + 1] ** 2;
    sums[2] += arr[i + 2] ** 2;
    sums[3] += arr[i + 3];
    totalPixels++;
  }

  let rgb =
    totalPixels === 0
      ? [0, 0, 0]
      : sums.slice(0, 3).map((s) => Math.round(Math.sqrt(s / totalPixels)));
  let xyz = RGBtoXYZ(rgb[0], rgb[1], rgb[2]);
  let lab = XYZtoLAB(xyz[0], xyz[1], xyz[2]);

  return { rgb, lab, totalPixels, transparentPixels };
};

const RGBtoXYZ = (R, G, B) => {
  R /= 255;
  G /= 255;
  B /= 255;

  R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
  G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
  B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

  R *= 100;
  G *= 100;
  B *= 100;

  return [
    R * 0.4124 + G * 0.3576 + B * 0.1805,
    R * 0.2126 + G * 0.7152 + B * 0.0722,
    R * 0.0193 + G * 0.1192 + B * 0.9505,
  ];
};

const XYZtoLAB = (x, y, z) => {
  x /= 95.047;
  y /= 100.0;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};

const deltaE94 = (a, b) => {
  const deltaL = a[0] - b[0];
  const deltaA = a[1] - b[1];
  const deltaB = a[2] - b[2];
  const c1 = Math.sqrt(a[1] * a[1] + a[2] * a[2]);
  const c2 = Math.sqrt(b[1] * b[1] + b[2] * b[2]);
  const deltaC = c1 - c2;
  const deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  const sc = 1.0 + 0.045 * c1;
  const sh = 1.0 + 0.015 * c1;
  const deltaLKlsl = deltaL / 1.0;
  const deltaCkcsc = deltaC / sc;
  const deltaHkhsh = Math.sqrt(Math.max(deltaH, 0)) / sh;
  const i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return Math.sqrt(Math.max(i, 0));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default EmojiMosaic;
