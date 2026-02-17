function exportForGmail() {
    const core = document.getElementById('editor-core');
    if (!core) return;

    let temp = core.cloneNode(true);

    // 1. Nettoyage interface
    temp.querySelectorAll('.delete-block').forEach(el => el.remove());
    temp.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

    // --- CAPTURE ALIGNEMENTS IMAGES ---
    const imgData = [];
    temp.querySelectorAll('.block-float img').forEach((img, i) => {
        const parent = img.closest('.block-float');
        imgData[i] = parent.classList.contains('left') ? 'left' : 
                     parent.classList.contains('right') ? 'right' : 'none';
    });

    // 2. RESET TOTAL
    temp.querySelectorAll('*').forEach(el => el.removeAttribute('style'));

    // 3. RÉINJECTION DESIGN SYSTEM
    for (let tag in designSystem) {
        temp.querySelectorAll(tag).forEach(el => {
            if (!el.classList.contains('has-lettrine')) {
                el.style.fontSize = designSystem[tag].fontSize;
                el.style.fontFamily = "Arial, sans-serif";
                el.style.lineHeight = "1.6";
                el.style.marginBottom = "20px";
                el.style.color = "#333333";
                el.style.display = "block";
            }
        });
    }

// 3.1 FLOAT DES IMAGES (Taille réduite pour libérer le texte)
    temp.querySelectorAll('.block-float img').forEach((img, i) => {
        img.style.maxWidth = "200px"; // Réduit de 280px à 200px
        img.style.height = "auto";
        img.style.display = "inline";
        img.style.verticalAlign = "top"; // Aligne le haut de l'image avec le haut du texte

        if (imgData[i] === 'left') {
            img.style.float = "left";
            img.style.marginRight = "20px";
            img.style.marginBottom = "10px";
        } else if (imgData[i] === 'right') {
            img.style.float = "right";
            img.style.marginLeft = "20px";
            img.style.marginBottom = "10px";
        }
    });

    // 4. STRUCTURE DES COLONNES
    temp.querySelectorAll('.grid-wrapper').forEach(grid => {
        grid.style.width = "100%";
        grid.style.display = "block";
        grid.style.fontSize = "0"; 
        grid.style.textAlign = "left";

        const cols = grid.querySelectorAll('.col-item');
        cols.forEach(col => {
            col.classList.add('mobile-col');
            col.style.display = "inline-block";
            col.style.verticalAlign = "top";
            col.style.width = (100 / cols.length) + "%";
            col.style.boxSizing = "border-box";
            col.style.padding = "0 10px";
            col.style.textAlign = "left";
            
            if (!col.classList.contains('has-lettrine')) {
                col.style.fontFamily = "Arial, sans-serif";
                col.style.fontSize = designSystem['p'] ? designSystem['p'].fontSize : "16px";
                col.style.lineHeight = "1.6";
                col.style.color = "#333333";
            }
        });
    });

    // 5. LA LETTRINE
    temp.querySelectorAll('.has-lettrine').forEach(el => {
        el.classList.add('mobile-col');
        const pureText = el.textContent.trim();
        const first = pureText.charAt(0);
        const rest = pureText.slice(1);
        const pSize = designSystem['p'] ? designSystem['p'].fontSize : "18px";

        el.style.cssText = `display:inline-block; vertical-align:top; width:33.3333%; box-sizing:border-box; padding:0 10px; font-family: Arial, sans-serif; text-align: left;`;

        el.innerHTML = `
            <div style="line-height: 1.6; font-family: Arial, sans-serif; text-align: left;">
                <span style="float: left; font-size: 72px; line-height: 60px; margin-top: 5px; margin-right: 12px; font-weight: bold; color: #000000; font-family: Georgia, serif; display: block;">
                    ${first}
                </span>
                <span style="font-size: ${pSize}; line-height: 1.6; color: #333333; font-family: Arial, sans-serif; display: inline;">
                    ${rest}
                </span>
                <div style="clear: both; line-height: 0;"></div>
            </div>
        `.trim();
    });

const styleContent = `
        body { 
            margin: 0; 
            padding: 10px; 
            background: #f4f4f4; 
            font-family: Arial, sans-serif; 
            text-align: center; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: #ffffff; 
            padding: 20px; 
            border: 1px solid #ddd; 
            text-align: left; 
        }
        
        @media only screen and (max-width: 600px) {
            .container { 
                padding: 15px !important; 
                width: 100% !important; 
                box-sizing: border-box !important; 
            }
            .mobile-col { 
                width: 100% !important; 
                display: block !important; 
                padding: 10px 0 !important; 
            }
            .block-float img { 
                float: none !important; 
                margin: 0 auto 20px auto !important; 
                width: 100% !important; 
                max-width: 100% !important;
                display: block !important;
            }
        }
    `;

    const win = window.open("", "_blank");
    if (win) {
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${styleContent}</style>
            </head>
            <body style="margin:0; padding:10px;">
                <div class="container">${temp.innerHTML}</div>
            </body>
            </html>
        `);
        win.document.close();
    }
}