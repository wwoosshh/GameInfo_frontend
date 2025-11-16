// 카테고리별 폼 필드 정의
const categoryFields = {
    // 신규 필드
    new_field: [
        { name: 'name', label: '필드 이름', type: 'text', required: true },
        { name: 'name_en', label: '영문명', type: 'text', required: false },
        { name: 'image_url', label: '이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'region', label: '지역명', type: 'select', required: true, options: [
            '은하열차', '우주정거장', '야릴로-VI', '선주 나부', '페나코니', '앰포리어스'
        ]},
        { name: 'sub_region', label: '하위 지역명', type: 'text', required: false }
    ],

    // 신규 운명의 길
    new_path: [
        { name: 'name', label: '운명의 길 이름', type: 'text', required: true },
        { name: 'image_url', label: '아이콘 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'role', label: '역할군', type: 'select', required: true, options: [
            '딜러', '공격형 서포터', '방어형 서포터', '기타'
        ]},
        { name: 'taunt_value', label: '도발수치', type: 'number', required: true },
        { name: 'characteristics', label: '특징', type: 'textarea', required: false }
    ],

    // 신규/복각 캐릭터
    new_character: [
        { name: 'name', label: '캐릭터 이름', type: 'text', required: true },
        { name: 'nickname', label: '이명/별명', type: 'text', required: false },
        { name: 'image_url', label: '캐릭터 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'gender', label: '성별', type: 'select', required: true, options: ['남성', '여성'] },
        { name: 'affiliation', label: '소속', type: 'text', required: false },
        { name: 'element', label: '속성', type: 'select', required: true, options: [
            '물리', '화염', '얼음', '번개', '바람', '양자', '허수'
        ]},
        { name: 'path', label: '운명의 길', type: 'select', required: true, options: [
            '파멸', '수렵', '지식', '화합', '공허', '보존', '풍요', '기억'
        ]},
        { name: 'rarity', label: '성급', type: 'select', required: true, options: ['4성', '5성'] },
        { name: 'name_ko', label: '한국어 표기', type: 'text', required: false },
        { name: 'name_en', label: '영어 표기', type: 'text', required: false },
        { name: 'name_cn', label: '중국어 표기', type: 'text', required: false },
        { name: 'name_jp', label: '일본어 표기', type: 'text', required: false },
        { name: 'voice_actor_ko', label: '한국 성우', type: 'text', required: false },
        { name: 'voice_actor_en', label: '영어 성우', type: 'text', required: false },
        { name: 'voice_actor_cn', label: '중국 성우', type: 'text', required: false },
        { name: 'voice_actor_jp', label: '일본 성우', type: 'text', required: false }
    ],

    // 신규/복각 광추
    new_lightcone: [
        { name: 'name', label: '광추 이름', type: 'text', required: true },
        { name: 'image_url', label: '광추 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'path', label: '운명의 길', type: 'select', required: true, options: [
            '파멸', '수렵', '지식', '화합', '공허', '보존', '풍요', '기억'
        ]},
        { name: 'rarity', label: '성급', type: 'select', required: true, options: ['3성', '4성', '5성'] },
        { name: 'base_hp', label: '기본 HP', type: 'number', required: false },
        { name: 'base_atk', label: '기본 공격력', type: 'number', required: false },
        { name: 'base_def', label: '기본 방어력', type: 'number', required: false },
        { name: 'skill_name', label: '광추 스킬명', type: 'text', required: false },
        { name: 'skill_description', label: '광추 스킬 설명', type: 'textarea', required: false },
        { name: 'acquisition_method', label: '획득 경로', type: 'text', required: false },
        { name: 'name_ko', label: '한국어 표기', type: 'text', required: false },
        { name: 'name_en', label: '영어 표기', type: 'text', required: false },
        { name: 'name_cn', label: '중국어 표기', type: 'text', required: false },
        { name: 'name_jp', label: '일본어 표기', type: 'text', required: false }
    ],

    // 신규 유물
    new_relic: [
        { name: 'name', label: '유물 이름', type: 'text', required: true },
        { name: 'image_url', label: '유물 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'type', label: '유형', type: 'select', required: true, options: ['유물', '차원 장신구'] },
        { name: 'set_2pc_effect', label: '2세트 효과', type: 'textarea', required: true },
        { name: 'set_4pc_effect', label: '4세트 효과 (유물만)', type: 'textarea', required: false },
        { name: 'acquisition_method', label: '획득처', type: 'text', required: false },
        { name: 'name_ko', label: '한국어 표기', type: 'text', required: false },
        { name: 'name_en', label: '영어 표기', type: 'text', required: false },
        { name: 'name_cn', label: '중국어 표기', type: 'text', required: false },
        { name: 'name_jp', label: '일본어 표기', type: 'text', required: false }
    ],

    // 신규 개척 임무
    new_trailblaze: [
        { name: 'name', label: '임무 이름', type: 'text', required: true },
        { name: 'image_url', label: '임무 썸네일 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'chapter_number', label: '막 수', type: 'text', required: false },
        { name: 'subtitle', label: '부제목', type: 'text', required: false },
        { name: 'unlock_condition', label: '개방 조건', type: 'text', required: false },
        { name: 'description', label: '설명', type: 'textarea', required: false }
    ],

    // 신규 동행 임무
    new_companion: [
        { name: 'name', label: '임무 이름', type: 'text', required: true },
        { name: 'image_url', label: '임무 썸네일 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'chapter_number', label: '막 수', type: 'text', required: false },
        { name: 'subtitle', label: '부제목', type: 'text', required: false },
        { name: 'unlock_condition', label: '개방 조건', type: 'text', required: false },
        { name: 'description', label: '설명', type: 'textarea', required: false }
    ],

    // 신규 모험 임무
    new_adventure: [
        { name: 'name', label: '임무 이름', type: 'text', required: true },
        { name: 'image_url', label: '임무 썸네일 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'chapter_number', label: '막 수', type: 'text', required: false },
        { name: 'subtitle', label: '부제목', type: 'text', required: false },
        { name: 'unlock_condition', label: '개방 조건', type: 'text', required: false },
        { name: 'description', label: '설명', type: 'textarea', required: false }
    ],

    // 신규 코스튬
    new_costume: [
        { name: 'name', label: '코스튬 이름', type: 'text', required: true },
        { name: 'image_url', label: '코스튬 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'character_name', label: '대상 캐릭터', type: 'text', required: true },
        { name: 'acquisition_method', label: '입수 방법', type: 'text', required: false },
        { name: 'release_version', label: '출시 버전', type: 'text', required: false }
    ],

    // 신규 이벤트
    new_event: [
        { name: 'name', label: '이벤트 이름', type: 'text', required: true },
        { name: 'image_url', label: '이벤트 배너 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'event_type', label: '이벤트 유형', type: 'select', required: true, options: [
            '지급성', '이벤트 스토리', '홈페이지', '미니게임'
        ]},
        { name: 'description', label: '설명', type: 'textarea', required: false },
        { name: 'rewards', label: '보상', type: 'textarea', required: false }
    ],

    // 혜택 및 육성 지원
    support_event: [
        { name: 'name', label: '지원 이름', type: 'text', required: true },
        { name: 'image_url', label: '배너 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'support_type', label: '지원 유형', type: 'text', required: false },
        { name: 'description', label: '설명', type: 'textarea', required: false },
        { name: 'duration', label: '기간', type: 'text', required: false }
    ],

    // 신규 콘텐츠
    new_content: [
        { name: 'name', label: '콘텐츠 이름', type: 'text', required: true },
        { name: 'image_url', label: '콘텐츠 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'content_type', label: '콘텐츠 유형', type: 'select', required: false, options: [
            '시스템', '영구 콘텐츠'
        ]},
        { name: 'description', label: '설명', type: 'textarea', required: false }
    ],

    // 신규 적
    new_enemy: [
        { name: 'name', label: '적 이름', type: 'text', required: true },
        { name: 'image_url', label: '적 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'nickname', label: '별칭', type: 'text', required: false },
        { name: 'affiliation', label: '소속', type: 'text', required: false },
        { name: 'element_weakness', label: '속성 약점 (쉼표로 구분)', type: 'text', required: false,
          placeholder: '물리, 화염, 번개' },
        { name: 'description', label: '설명', type: 'textarea', required: false },
        { name: 'resistance_physical', label: '물리 저항 (%)', type: 'number', required: false },
        { name: 'resistance_fire', label: '화염 저항 (%)', type: 'number', required: false },
        { name: 'resistance_ice', label: '얼음 저항 (%)', type: 'number', required: false },
        { name: 'resistance_lightning', label: '번개 저항 (%)', type: 'number', required: false },
        { name: 'resistance_wind', label: '바람 저항 (%)', type: 'number', required: false },
        { name: 'resistance_quantum', label: '양자 저항 (%)', type: 'number', required: false },
        { name: 'resistance_imaginary', label: '허수 저항 (%)', type: 'number', required: false }
    ],

    // 신규 재료
    new_material: [
        { name: 'name', label: '재료 이름', type: 'text', required: true },
        { name: 'image_url', label: '재료 이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'usage', label: '재료 사용처', type: 'text', required: false },
        { name: 'rarity', label: '성급', type: 'select', required: false, options: [
            '1성', '2성', '3성', '4성', '5성'
        ]},
        { name: 'description', label: '재료 설명', type: 'textarea', required: false },
        { name: 'acquisition_method', label: '획득 경로', type: 'text', required: false },
        { name: 'used_by_characters', label: '사용 캐릭터 (쉼표로 구분)', type: 'text', required: false }
    ],

    // 편의성 업데이트
    convenience: [
        { name: 'title', label: '업데이트 제목', type: 'text', required: true },
        { name: 'image_url', label: '이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'description', label: '설명', type: 'textarea', required: false }
    ],

    // 기타
    other: [
        { name: 'title', label: '제목', type: 'text', required: true },
        { name: 'image_url', label: '이미지 URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'description', label: '설명', type: 'textarea', required: false }
    ]
};

// 복각 캐릭터와 복각 광추는 신규와 동일한 필드 사용
categoryFields.rerun_character = categoryFields.new_character;
categoryFields.rerun_lightcone = categoryFields.new_lightcone;

// 카테고리 변경 시 폼 필드 업데이트
function updateFormFields() {
    const category = document.getElementById('category').value;
    const dynamicFields = document.getElementById('dynamicFields');

    if (!category || !categoryFields[category]) {
        dynamicFields.innerHTML = '';
        return;
    }

    const fields = categoryFields[category];
    let html = '';

    fields.forEach(field => {
        html += generateFieldHTML(field);
    });

    dynamicFields.innerHTML = html;
}

// 필드 HTML 생성
function generateFieldHTML(field) {
    const requiredMark = field.required ? ' *' : '';
    const fieldId = `field_${field.name}`;

    let inputHTML = '';

    switch (field.type) {
        case 'text':
            inputHTML = `
                <input type="text"
                       id="${fieldId}"
                       ${field.required ? 'required' : ''}
                       placeholder="${field.placeholder || ''}"
                       class="form-control">
            `;
            break;

        case 'number':
            inputHTML = `
                <input type="number"
                       id="${fieldId}"
                       ${field.required ? 'required' : ''}
                       placeholder="${field.placeholder || ''}"
                       class="form-control">
            `;
            break;

        case 'textarea':
            inputHTML = `
                <textarea id="${fieldId}"
                          ${field.required ? 'required' : ''}
                          placeholder="${field.placeholder || ''}"
                          rows="3"
                          class="form-control"></textarea>
            `;
            break;

        case 'select':
            inputHTML = `
                <select id="${fieldId}"
                        ${field.required ? 'required' : ''}
                        class="form-control">
                    <option value="">선택하세요</option>
                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            `;
            break;

        case 'checkbox':
            inputHTML = `
                <div class="checkbox-group">
                    <input type="checkbox" id="${fieldId}">
                    <label for="${fieldId}">${field.label}</label>
                </div>
            `;
            return inputHTML; // checkbox는 다른 레이아웃

        default:
            inputHTML = `<input type="text" id="${fieldId}" class="form-control">`;
    }

    return `
        <div class="form-group">
            <label for="${fieldId}">${field.label}${requiredMark}</label>
            ${inputHTML}
        </div>
    `;
}

// 전역으로 노출
window.updateFormFields = updateFormFields;
window.categoryFields = categoryFields;
