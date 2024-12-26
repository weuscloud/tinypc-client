const GameDefaults = {

    MISSING_MIN_MAX_KEY: 1,
    MISSING_MIN_MAX_KEY_STR: 'Missing min or max key',

    MAXIMUM_GENERATED_NUMBERS: 100,
    MINIMUM_GENERATED_NUMBERS: 10,
    DEFAULT_GENERATED_NUMBERS: 10,// 默认数字生成范围数值0-100
    INVALID_GENERATED_NUMBERS_STR: 'Invalid generated numbers',
    INVALID_GENERATED_NUMBERS: 2,

    MAXIMUM_CARD_COUNT: 10,
    MINIMUM_CARD_COUNT: 4,
    DEFAULT_CARD_COUNT: 4, // 默认生成4张卡牌3-7
    INVALID_CARD_COUNT_STR: 'Invalid card count',
    INVALID_CARD_COUNT: 3,

    MAXIMUM_TIME_LIMIT: 120,
    MINIMUM_TIME_LIMIT: 30,
    DEFAULT_TIME_LIMIT: 30,// 默认时间限制30秒
    INVALID_TIME_LIMIT_STR: 'Invalid time limit',
    INVALID_TIME_LIMIT: 4,

    DEFAULT_PLAYER_NAME: 'Player',// 玩家名称
    MAXIMUM_PLAYER_NAME: 20,// 玩家名称最大长度
    MINIMUM_PLAYER_NAME: 2,// 玩家名称最小长度
    INVALID_PLAYER_NAME_STR: 'Invalid player name',
    INVALID_PLAYER_NAME: 5,
}

function validateValue(keyname, newValue, defaults) {
    
    // 参数检查
    if (typeof keyname!=='string' || typeof newValue === 'undefined' ||!defaults || typeof defaults!== 'object') {
        throw new Error('Invalid parameter');
    }

    // 验证keyname是否符合变量命名规则
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(keyname)) {
        throw new Error('keyname does not conform to variable naming rules');
    }

    // 改进keyname处理
    keyname = keyname
     .replace(/\s|-/g, '_') // 将空格和 - 替换为 _
     .toUpperCase(); // 转换为大写
     
    const prefixes = ['MINIMUM_', 'MAXIMUM_'];
    const minKey = prefixes[0] + keyname;
    const maxKey = prefixes[1] + keyname;

    // 检查MINIMUM_和MAXIMUM_键是否存在
    if (!defaults[minKey] ||!defaults[maxKey]) {
        throw new Error(defaults.MISSING_MIN_MAX_KEY_STR);
    }

    const defaultValue = defaults[keyname.replace('MAXIMUM_', '').replace('MINIMUM_', '')];
    const defaultValueType = typeof defaultValue;

    if (defaultValueType === 'number') {
        if (typeof newValue!== 'number' || newValue < defaults[minKey] || newValue > defaults[maxKey]) {
            return defaults['INVALID_' + keyname];
        }
    } else if (defaultValueType ==='string') {
        if (typeof newValue!=='string' || newValue.length < defaults[minKey] || newValue.length > defaults[maxKey]) {
            return defaults['INVALID_' + keyname];
        }
    }
    return newValue;
}
