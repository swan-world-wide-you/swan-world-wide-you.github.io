<!DOCTYPE html>
<body>
    <!-- デバッグ用　始め -->
<input type="button" value="debug" onclick="modalTest()">
    <script>
        function modalTest(){
            let modalarray = [
                ["OK","oknobaai(`OKだった！`)"],
                ["キャンセル","cancelnobaai(`キャンセルすんな！`)"],
                ["中止したい","abortnobaai(`中止とか・・・`)"]
            ];
            openModal("本当によろしいですか？<br>よろしい場合はOKを押してください","最後の確認です","",modalarray);
        }
        function oknobaai(str){
            alert("OKが押されました。渡された引数は"+str+"です。");
        }

        function cancelnobaai(str){
            alert("キャンセルが押されました！渡された引数は"+str+"です。")
        }

        function abortnobaai(str){
            alert("中止が押されました！渡された引数は"+str+"です。")
        }
    </script>
    <!-- デバッグ用　終わり -->

    <dialog id="modal-container">
        <form id="modal-form">
        <div id="modal-header" class="modal-head"></div>
        <div id="modal-prompt" class="modal-body"></div>
        <div id="modal-buttons"></div>
        <div id="modal-footer" class="modal-foot"></div>
        </form>
    </dialog>

    <style>
        .buttonClass{
            height: 40px;
            width: 150px;
        }
        #modal-header{
            background-color: darkgreen;
            color: white;
            padding: 5px;
            font-size: 20pt;
            font-weight: bold;
            align-content: center;
        }
        #modal-prompt{
            font-size:14pt;
            padding: 15px;
        }
        #modal-footer{
            font-size: 12pt;
        }
    </style>
    
    <script>
        // グローバル変数の定義
        const modalDialog = document.getElementById("modal-container");
        const modalHeader = document.getElementById("modal-header");
        const modalPrompt = document.getElementById("modal-prompt");
        const modalButton = document.getElementById("modal-buttons");
        const modalFooter = document.getElementById("modal-footer");

        /**
         * モーダルダイアログを表示します。
         * @param {string} prompt ダイアログの内容です。
         * @param {string} header ダイアログのタイトルです。何も指定しない場合、「確認」が表示されます。
         * @param {string} footer ダイアログのフッターです。
         * @param {enum} modaltype ダイアログの種類です。表示するボタンを設定します。
         * @param {array} label_func ボタンラベルと関数名の組です[[label,function],[label,function],...]。
         * @return {void} void 戻り値なし
         */
        function openModal(prompt, header, footer, label_func){
            // 引数不足時の例外処理
            if(!header){
                header = "確認"; // ヘッダが指定されなかったときに表示する項目
            }
            if(!footer){
                footer = ""; // フッタが指定されなかったときに表示する項目
            }
            if(!label_func){
                label_func = [["OK",""]]; // ボタン設定がされなかったときにはOKボタンを表示、押しても何も実行しない
            }

            // ダイアログにタグを挿入
            modalHeader.insertAdjacentHTML("beforeend",header);
            modalFooter.insertAdjacentHTML("beforeend",footer);
            modalPrompt.insertAdjacentHTML("beforeend",prompt);
            modalButton.insertAdjacentHTML("beforeend",composeBtnTag(label_func));
            modalDialog.showModal();
        }

        /** ボタン部分のタグを生成します。
         * @param {enum} label_func ボタンセットのパターンを指定します。
         * @return {string} returnHTML ボタン部分のタグを返します。
         */
        function composeBtnTag(label_func){
            let returnHTML = "";
            
            label_func.forEach((array_inside) => {
                let buttonTag = "<input type='button' class='buttonClass' onclick='{closeDialog();"; // 押下時にダイアログのリセット関数を発火
                buttonTag += array_inside[1] + "}' value='" + array_inside[0] + "'>";
                returnHTML += buttonTag;
            });

            return returnHTML;
        }

        /** ダイアログを閉じます。
         * @return {void} void 戻り値なし
         */
        function closeDialog(){
            modalHeader.innerHTML = "";
            modalPrompt.innerHTML = "";
            modalButton.innerHTML = "";
            modalFooter.innerHTML = "";
            modalDialog.close();
        }

    </script>
</body>
</html>
