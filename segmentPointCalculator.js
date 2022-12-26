/*
＊人工無能　クライアント側で走る疑似チャットボットです。
＊これis何？：度数分布をもとに単語ごとの重みづけを行い、重みづけ点数法により予め用意した質問との一致度を計算するプログラムです。
＊このコードチャンクが正常に動作するには、TinySegmenterが必要です。http://chasen.org/~taku/software/TinySegmenter/
＊チャットボットのライブラリはbotUIが手軽です。
    ・https://qiita.com/t_power/items/e966b4a5f35340ed9a41
    ・<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/botui/build/botui.min.css" />
    ・<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/botui/build/botui-theme-default.css" />
    ・<script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    ・<script src="https://cdn.jsdelivr.net/npm/botui/build/botui.js"></script>
*/

// 度数分布に算定しない単語
const wordExcluded = [
    "が","の","を","に","へ","と","から","より","で","の","と","や","し","やら","か","なり","だの","ばかり","まで","だけ","ほど","くらい","ぐらい",
    "など","等","か","または","ずつ","のみ","きり","は","も","こそ","でも","しか","さえ","ば","と","でも","ても","けれど","けれども","のに","ので",
    "から","し","て","で","なり","ながら","たり","つつ","ところで","まま","ものの","思い","考え","おそらく","恐らく","ます","です","だろう","確認",
    "検証","連絡","手数","お手数","迷惑","お疲れ","疲れ","様","担当","ご担当","お忙しい","忙しい","いる","れる","られる","される","データ","情報",
    "問合せ","問い合わせ","お問合せ","質問","ご質問","アドバイス","教示","幸い","早速","表題","掲題","本件","行い","まし","する","なる","頂い","伺っ",
    "伺う","お伺い","、","。","…","・","＆","&",",",".","「","」","@","＠","*","?","？","/","\\","Re","RE","Fw","FW","返回","返信","【","】","[","]",
    "該当","添付","貼付"," ",":","：","時","分","秒","\t","願い","お願い","よろしく","宜しく","存じ","頂き","たい","させて","して","思っ","思って","おり",
    "\"","0","1","2","3","4","5","6","7","8","9","について","ついて","つきまし","つき","でしょ","でし","やり","こと","もの","者","及び","および",
    "または","また","しかし","そして","あと","上記","画像","下記","右記","上述","左記","事象","＜","＞","<",">","問題","発生","処理","以上","検討","-","'",
    "+","＋","ー","―","ませ","なく","ない"
];

/**
 * getFreq 文を分かち書きし、単語ごとに度数を返します。
 * @param {string} sentence 分かち書きしたい文です。
 * @returns {[[string,number]]} 単語と度数を含む二次元配列です。
 */
function getFreq(sentence){
    const segmenter = new TinySegmenter();
    const sentenceSegmented = segmenter.segment(sentence);
    const sentenceSegmentedUnique = Array.from(new Set([...sentenceSegmented]));
    const arrayReturn = [];

    sentenceSegmentedUnique.forEach((wordUnique) => {
        // 1文字を除外
        if(wordUnique.length <= 1){
            return;
        }

        // 除外語を除外
        if(wordExcluded.filter((excl) => {
            if(wordUnique == excl){
                return true;
            }else{
                return false;
            }}).length >= 1){
            return;
        }

        // 度数をカウント
        let count = sentenceSegmented.filter((word) => {
            if(word == wordUnique){
                return true;
            }else{
                return false;
            }
        }).length;

        // ユニークな単語と度数をプッシュ
        arrayReturn.push([wordUnique,count]);
    });
    return arrayReturn;
}

/**
 * getFreqPoint クエリに対して各単語の重みを算出し、質問と答えのセットからマッチ度を算出して、質問・答え・マッチ度を含む2次元配列で返します。
 * @param {string} sentence クエリ文です。
 * @param {[{question:string,response:string}]} answers 質問と答えの2次元配列です。
 * @returns {[string,string,number]} 質問・答え・マッチ度です。降順で並びます。
 */
function getFreqPoint(sentence,answers){
    const arrayWeight = getFreq(sentence);
    const arrayReturn = [];

    // 答えの2次元配列からウェイトを計算
    answers.forEach((answer) => {
        let questionSegmented = getFreq(answer.question);
        let weightPoint = 0;
        // 単語と度数の二次元配列でフィルタを掛ける
        for(let i = 0; i < arrayWeight[0].length; i++){
            for(let j = 0; j < questionSegmented.length; j++){
                if(arrayWeight[0][i] == questionSegmented[0][j]){
                    let weightPoint = arrayWeight[1][i] * questionSegmented[1][j];
                    arrayReturn.push([answer.question,answer.response,weightPoint]);
                    break;
                }
            }
        }
    });

    // 降順ソート
    arrayReturn.sort((a,b) => {
        if(a[2] > b[2]){
            return -1;
        }
    })

    return arrayReturn;
}
