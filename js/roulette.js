/**
 * Roulette Game Application
 * Handles the roulette functionality, name management, and history display
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const rouletteElement = document.getElementById('roulette');
    const spinButton = document.getElementById('spin-button');
    const nameInput = document.getElementById('name-input');
    const addNameButton = document.getElementById('add-name-button');
    const namesList = document.getElementById('names-list');
    const historyList = document.getElementById('history-list');

    // Colors for the roulette sections
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC249', '#EA526F', '#49BEAA', '#5271FF'
    ];

    // Application state
    let names = [];
    let isSpinning = false;
    let currentRotation = 0;

    // Initialize the application
    function init() {
        // Load saved names from storage
        names = storage.getNames();
        
        // If no names are saved, add default names
        if (names.length === 0) {
            names = ['名前1', '名前2', '名前3', '名前4', '名前5'];
            storage.saveNames(names);
        }
        
        // Render the initial state
        renderNames();
        renderRoulette();
        renderHistory();
        
        // Set up event listeners
        setupEventListeners();
        
        // Debug output
        console.log('Initialized with names:', names);
    }

    // Set up event listeners for user interactions
    function setupEventListeners() {
        // Add name button click
        addNameButton.addEventListener('click', addName);
        
        // Name input enter key
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addName();
            }
        });
        
        // Spin button click
        spinButton.addEventListener('click', spinRoulette);
    }

    // Add a new name to the list
    function addName() {
        const name = nameInput.value.trim();
        
        if (name === '') {
            alert('名前を入力してください');
            return;
        }
        
        if (names.includes(name)) {
            alert('その名前は既に追加されています');
            return;
        }
        
        if (names.length >= 10) {
            alert('名前は最大10個まで追加できます');
            return;
        }
        
        names.push(name);
        storage.saveNames(names);
        
        nameInput.value = '';
        renderNames();
        renderRoulette();
    }

    // Remove a name from the list
    function removeName(name) {
        // 自動削除の場合は、最低2つのチェックをスキップ（結果表示後の自動削除）
        const isAutoRemove = arguments.length > 1 && arguments[1] === true;
        
        if (!isAutoRemove && names.length <= 2) {
            alert('名前は最低2つ必要です');
            return;
        }
        
        const index = names.indexOf(name);
        if (index === -1) {
            console.error(`名前 "${name}" が見つかりません`);
            return;
        }
        
        // 名前を配列から削除
        names.splice(index, 1);
        console.log(`"${name}" を削除しました。残りの名前:`, names);
        
        // ストレージに保存
        storage.saveNames(names);
        
        // UIを更新
        renderNames();
        renderRoulette();
        
        // 名前が1つしか残っていない場合、ユーザーに通知
        if (names.length === 1) {
            alert('名前が1つしか残っていません。新しい名前を追加してください。');
        }
    }

    // Render the names list in the UI
    function renderNames() {
        namesList.innerHTML = '';
        
        names.forEach((name) => {
            const li = document.createElement('li');
            li.className = 'name-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.className = 'name-text';
            nameSpan.addEventListener('click', function() {
                // 名前をクリックしたら編集モードに切り替え
                const currentName = this.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentName;
                input.className = 'edit-name-input';
                
                // 入力完了時の処理
                input.addEventListener('blur', function() {
                    finishEdit(currentName, this.value);
                });
                
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        finishEdit(currentName, this.value);
                    }
                });
                
                // 入力欄に置き換え
                li.replaceChild(input, nameSpan);
                input.focus();
            });
            
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-name';
            removeButton.textContent = '削除';
            removeButton.onclick = function() {
                removeName(name);
            };
            
            li.appendChild(nameSpan);
            li.appendChild(removeButton);
            namesList.appendChild(li);
        });
    }
    
    // 名前の編集を完了する
    function finishEdit(oldName, newName) {
        newName = newName.trim();
        
        if (newName === '') {
            alert('名前を入力してください');
            renderNames(); // 元に戻す
            return;
        }
        
        if (newName === oldName) {
            renderNames(); // 変更なしなら元に戻す
            return;
        }
        
        if (names.includes(newName)) {
            alert('その名前は既に追加されています');
            renderNames(); // 元に戻す
            return;
        }
        
        // 名前を更新
        const index = names.indexOf(oldName);
        if (index !== -1) {
            names[index] = newName;
            storage.saveNames(names);
            renderNames();
            renderRoulette();
        }
    }

    // Render the roulette wheel with the current names
    function renderRoulette() {
        rouletteElement.innerHTML = '';
        
        const segmentAngle = 360 / names.length;
        
        // 1つのルーレットを作成
        const wheel = document.createElement('div');
        wheel.className = 'roulette-wheel';
        
        // SVGを使用して正確な円形セグメントを作成
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "-50 -50 100 100");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        
        // 各セグメントを描画
        names.forEach((name, index) => {
            const color = colors[index % colors.length];
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            
            // SVGパスでセグメントを作成
            const segment = document.createElementNS(svgNS, "path");
            
            // 角度をラジアンに変換
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            // 円弧の座標を計算
            const x1 = 50 * Math.cos(startRad);
            const y1 = 50 * Math.sin(startRad);
            const x2 = 50 * Math.cos(endRad);
            const y2 = 50 * Math.sin(endRad);
            
            // パスを定義（中心から始まり、円弧を描いて中心に戻る）
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
            const d = `M 0,0 L ${x1},${y1} A 50,50 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
            
            segment.setAttribute("d", d);
            segment.setAttribute("fill", color);
            segment.setAttribute("stroke", "#333");
            segment.setAttribute("stroke-width", "0.5");
            
            svg.appendChild(segment);
        });
        
        wheel.appendChild(svg);
        
        // 名前テキストを追加
        names.forEach((name, index) => {
            const textElement = document.createElement('span');
            textElement.className = 'roulette-text';
            textElement.textContent = name;
            const textAngle = index * segmentAngle + segmentAngle/2;
            
            // 円の中心からの距離を調整（半径の75%の位置に配置 - 外円付近）
            const distance = 140;
            
            // 名前の位置を計算（極座標から直交座標に変換）
            const radians = (textAngle - 90) * Math.PI / 180;
            const x = distance * Math.cos(radians);
            const y = distance * Math.sin(radians);
            
            // 名前を背景色の中央に配置
            textElement.style.position = 'absolute';
            textElement.style.top = `calc(50% + ${y}px)`;
            textElement.style.left = `calc(50% + ${x}px)`;
            textElement.style.transform = `translate(-50%, -50%) rotate(${textAngle}deg)`;
            
            wheel.appendChild(textElement);
        });
        
        // 中心点を作成
        const centerPoint = document.createElement('div');
        centerPoint.className = 'roulette-center';
        wheel.appendChild(centerPoint);
        
        rouletteElement.appendChild(wheel);
        
        console.log('ルーレットを更新しました。名前:', names);
    }

    // Spin the roulette wheel
    function spinRoulette() {
        if (isSpinning || names.length < 2) {
            return;
        }
        
        isSpinning = true;
        spinButton.disabled = true;
        
        // Calculate a random spin duration between 8-12 seconds
        // 短めの時間にして、減速効果をより自然に感じられるようにする
        const spinDuration = Math.random() * 4000 + 8000; // 8-12 seconds in milliseconds
        
        // Calculate a random number of rotations (5-10 full rotations plus a random segment)
        const rotations = 5 + Math.random() * 5;
        const randomAngle = Math.random() * 360;
        const totalRotation = 360 * rotations + randomAngle;
        
        // Apply the rotation with a more natural easing function
        currentRotation += totalRotation;
        rouletteElement.style.transition = `transform ${spinDuration/1000}s cubic-bezier(0.32, 0, 0.15, 1)`;
        rouletteElement.style.transform = `rotate(${currentRotation}deg)`;
        
        // Determine the winner after the spin completes
        setTimeout(() => {
            const segmentAngle = 360 / names.length;
            
            // Calculate which segment is at the top (opposite the needle)
            // The needle points to the top (0 degrees), so we need to find which segment is there
            const normalizedRotation = currentRotation % 360;
            const winningIndex = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
            
            const winner = names[winningIndex];
            
            // Create a timestamp for the result
            const now = new Date();
            const timestamp = now.toLocaleString('ja-JP');
            
            // Create and save the history entry
            const historyEntry = {
                name: winner,
                timestamp: timestamp
            };
            
            storage.addHistoryEntry(historyEntry);
            renderHistory();
            
            // Reset the spinning state
            isSpinning = false;
            spinButton.disabled = false;
            
            // Show the result and remove the winner from the list when OK is pressed
            alert(`結果: ${winner}`);
            
            // 当選した名前をリストから削除（自動削除モード）
            removeName(winner, true);
        }, spinDuration);
    }

    // Render the history list in the UI
    function renderHistory() {
        const history = storage.getHistory();
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = '履歴はありません';
            historyList.appendChild(li);
            return;
        }
        
        history.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = `${index + 1}. ${entry.name} - ${entry.timestamp}`;
            historyList.appendChild(li);
        });
    }

    // Initialize the application
    init();
});