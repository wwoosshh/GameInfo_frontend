/**
 * 이미지 업로드 유틸리티
 * Cloudinary를 사용한 이미지 업로드 기능
 */

// 이미지 파일 업로드 처리
async function handleImageUpload(fileInput, targetInputId) {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    // 파일 타입 확인
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        fileInput.value = '';
        return;
    }

    // 파일 크기 확인 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        fileInput.value = '';
        return;
    }

    const progressDiv = document.getElementById(`${targetInputId}_progress`);
    const previewDiv = document.getElementById(`${targetInputId}_preview`);
    const urlInput = document.getElementById(targetInputId);

    try {
        // 진행 상태 표시
        if (progressDiv) {
            progressDiv.style.display = 'block';
            progressDiv.textContent = '업로드 중...';
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('image', file);

        // API 호출
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8080/api/upload.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const responseText = await response.text();
        console.log('Server response:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON:', responseText);
            throw new Error('서버 응답 파싱 실패: ' + responseText.substring(0, 200));
        }

        if (result.success && result.data) {
            // 업로드 성공 - URL을 입력 필드에 설정
            const imageUrl = result.data.secure_url;
            urlInput.value = imageUrl;

            // 미리보기 표시
            if (previewDiv) {
                const img = previewDiv.querySelector('img');
                if (img) {
                    img.src = imageUrl;
                    previewDiv.style.display = 'block';
                }
            }

            // 성공 메시지
            if (progressDiv) {
                progressDiv.textContent = '✓ 업로드 완료';
                progressDiv.style.color = '#34d399';
                setTimeout(() => {
                    progressDiv.style.display = 'none';
                }, 3000);
            }

        } else {
            throw new Error(result.message || result.error || '업로드 실패');
        }

    } catch (error) {
        console.error('Upload error:', error);

        if (progressDiv) {
            progressDiv.textContent = '✗ 업로드 실패: ' + error.message;
            progressDiv.style.color = '#f87171';
        }

        alert('이미지 업로드에 실패했습니다: ' + error.message);
    }

    // 파일 입력 초기화
    fileInput.value = '';
}

// 이미지 URL 입력 필드 변경 시 미리보기 업데이트
function updateImagePreview(inputId) {
    const urlInput = document.getElementById(inputId);
    const previewDiv = document.getElementById(`${inputId}_preview`);

    if (!urlInput || !previewDiv) {
        return;
    }

    const url = urlInput.value.trim();
    const img = previewDiv.querySelector('img');

    if (url && img) {
        img.src = url;
        previewDiv.style.display = 'block';
    } else {
        previewDiv.style.display = 'none';
    }
}

// 전역으로 노출
window.handleImageUpload = handleImageUpload;
window.updateImagePreview = updateImagePreview;
