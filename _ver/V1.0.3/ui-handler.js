(function() { // PiP Button Injection Script
    // The Core PiP Logic v1.0.3
    async function togglePiP() {
        const video = document.querySelector('video');
        if (!video || !document.pictureInPictureEnabled) return;

        try {
            const currentPiP = document.pictureInPictureElement;

            if (currentPiP) {
                if (currentPiP === video) {
                    await document.exitPictureInPicture();
                    return;
                }
                await document.exitPictureInPicture();
            }

            video.disablePictureInPicture = false;
            if (video.readyState === 0) {
                await new Promise((resolve) => {
                    const onLoadedMetadata = () => {
                        video.removeEventListener('loadedmetadata', onLoadedMetadata);
                        resolve();
                    };
                    video.addEventListener('loadedmetadata', onLoadedMetadata);
                });
            }

            await video.requestPictureInPicture();
        } catch (error) {
            console.error('PiP failed', error);
        }
    }

    // 2. The Injection Logic with Tooltips
    function injectMyButton() {
        if (document.getElementById('my-custom-pip')) return;

        const rightGroup = document.querySelector('.ytp-right-controls-right');
        if (!rightGroup) return;

        const btn = document.createElement('button');
        btn.id = 'my-custom-pip';
        btn.className = 'ytp-button';
        
        // Added YouTube-native Tooltip and Accessibility tags
        btn.setAttribute('data-priority', '9');
        btn.setAttribute('data-tooltip-title', 'Picture-in-Picture');
        btn.setAttribute('data-title-no-tooltip', 'Picture-in-Picture');
        btn.setAttribute('aria-label', 'Picture-in-Picture');

        btn.innerHTML = `
            <svg height="24" viewBox="0 0 24 24" width="24"><path d="M21.20 3.01C21.66 3.05 22.08 3.26 22.41 3.58C22.73 3.91 22.94 4.33 22.98 4.79L23 5V19C23.00 19.49 22.81 19.97 22.48 20.34C22.15 20.70 21.69 20.93 21.20 20.99L21 21H3L2.79 20.99C2.30 20.93 1.84 20.70 1.51 20.34C1.18 19.97 .99 19.49 1 19V13H3V19H21V5H11V3H21L21.20 3.01ZM1.29 3.29C1.10 3.48 1.00 3.73 1.00 4C1.00 4.26 1.10 4.51 1.29 4.70L5.58 9H3C2.73 9 2.48 9.10 2.29 9.29C2.10 9.48 2 9.73 2 10C2 10.26 2.10 10.51 2.29 10.70C2.48 10.89 2.73 11 3 11H9V5C9 4.73 8.89 4.48 8.70 4.29C8.51 4.10 8.26 4 8 4C7.73 4 7.48 4.10 7.29 4.29C7.10 4.48 7 4.73 7 5V7.58L2.70 3.29C2.51 3.10 2.26 3.00 2 3.00C1.73 3.00 1.48 3.10 1.29 3.29ZM19.10 11.00L19 11H12L11.89 11.00C11.66 11.02 11.45 11.13 11.29 11.29C11.13 11.45 11.02 11.66 11.00 11.89L11 12V17C10.99 17.24 11.09 17.48 11.25 17.67C11.42 17.85 11.65 17.96 11.89 17.99L12 18H19L19.10 17.99C19.34 17.96 19.57 17.85 19.74 17.67C19.90 17.48 20.00 17.24 20 17V12L19.99 11.89C19.97 11.66 19.87 11.45 19.70 11.29C19.54 11.13 19.33 11.02 19.10 11.00ZM13 16V13H18V16H13Z" fill="white"></path></svg>
        `;

        btn.onclick = togglePiP;

        // Insert at the start of the right-hand controls
        rightGroup.insertBefore(btn, rightGroup.firstChild);
    }

    // 3. Execution & Persistence
    // Listen for YouTube navigation changes
    document.addEventListener('yt-navigate-finish', injectMyButton);

    // Initial load check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectMyButton);
    } else {
        injectMyButton();
    }

    // Safety fallback: sometimes yt-navigate-finish fires before the DOM is ready
    // This ensures the button stays there if the player refreshes dynamically.
    setInterval(injectMyButton, 2000);
})();

(function() { // Logo Replacement Script
    const customLogoHTML = `<span class="yt-icon-shape style-scope yt-icon ytSpecIconShapeHost"><div style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg xmlns="http://www.w3.org/2000/svg" id="yt-ringo2-red-svg_yt197" class="external-icon" width="101" height="20" viewBox="0 0 101 20" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%"><g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"></path><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path></g><g id="youtube-paths_yt197"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"></path><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z"></path><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"></path><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"></path><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"></path><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"></path><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"></path></g></svg></div></span>`;

    function applyLogo() {
        const ytIconLogo = document.querySelector('yt-icon.ytd-logo');
        const logoIcon = document.querySelector('#logo-icon');
        
        if (logoIcon && !logoIcon.classList.contains('custom-modified')) {
            // Apply width and replace HTML
            if (ytIconLogo) ytIconLogo.style.width = '101px';
            logoIcon.innerHTML = customLogoHTML;
            logoIcon.classList.add('custom-modified');
        }
    }

    applyLogo();

    // Observer focused on the header container for better performance
    const observer = new MutationObserver(applyLogo);
    const target = document.querySelector('#masthead-container') || document.body;
    observer.observe(target, { childList: true, subtree: true });
})();