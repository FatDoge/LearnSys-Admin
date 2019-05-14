import * as R from 'ramda';
import currencyjs from 'currency.js';
import { parse } from 'qs';

/**
 * 在列表头部新增一条数据
 * @param {*} list
 * @param {*} requestData
 */
export function addOneToList(list, requestData) {
  if (!list) return;

  return R.prepend(requestData)(list);
}

/**
 * 编辑列表中的一条数据
 * @param {*} list
 * @param {*} requestData
 */
export function editOneInList(list, requestData) {
  if (!list) return;

  const fn = item => {
    if (R.propEq('id', requestData.id)(item)) {
      return R.merge(item, requestData);
    } else {
      return item;
    }
  };

  return R.map(fn)(list);
}

/**
 * 删除列表中的一条数据
 * @param {*} list
 * @param {*} id
 */
export function deleteOneInList(list, propertyName, property) {
  if (!list) return;

  return R.reject(R.propEq(propertyName, property))(list);
}

/**
 * 找到列表中的一条数据
 * @param {*} list
 * @param {*} id
 */
export function findOneInList(list, propertyName, property) {
  if (!list) return;

  return R.find(R.propEq(propertyName, property))(list);
}

/**
 * 编辑current中的一条数据
 * @param {*} data
 * @param {*} requestData
 */
export function editOneInData(data, requestData) {
  if (!data[requestData.id]) return;

  return R.merge(data, {
    [requestData.id]: {
      ...requestData,
    },
  });
}

/**
 * 取出数组成员的某个属性，组成一个新数组
 */
export function getPropertyToArray(originArray, property) {
  return R.pluck(property)(originArray);
}

/**
 * 在列表尾部新增一条数据
 * @param {*} list
 * @param {*} requestData
 */
export function addOneToListLast(list, requestData) {
  if (!list) return;

  return R.append(requestData)(list);
}
/*
* 获取window.location.search内的参数
* */
export function getLocationParams() {
  const { location: { search } } = window;
  return parse(R.replace(/^\?/, '', search));
}
/*
* replace富文本编辑器内转义过的内容
* */
export function replaceLabel(html) {
  if (!html) return;
  return html.replace(/(&quot;|&amp;#x22;|&#39;|&#x22;)/ig, '\'').replace(/<p/g, '<div').replace(/<\/p>/g, '</div>');
}

/**
 * 金额转换
 * @param {Number} value 金额 (分)
 */
export const currency = value => {
  return currencyjs(value * 100, { precision: 0 });
}

/**
 * 过滤对象中元素为空的元素
 */
export const filterObj = obj => {
  const isEven = n => !!n;
  return R.filter(isEven)(obj)
}

/**
 * 返回对象自身的属性的属性值组成的数组
 */
export const getValues = obj => {
  return R.values(obj)
}

/**
 * 在原数组上删除指定项
 * @param {Array} arr
 * @param {Function} callback 每个项的操作方法,返回true表示删除该项
 */
export function delArrayItem(arr, callback) {
  for (let i = 0; i < arr.length; i += 1) {
    if (callback(arr[i], i) === true) {
      arr.splice(i, 1);
    }
  }
}

/**
 * 正则检查手机号
 * @param {number} phone
 */
export function checkPhone(phone) {
  return /^1[3456789]\d{9}$/.test(phone)
}

/**
 * 合并一个数组中所有对象
 * @param {Array} arr
 */
export function mergeAll(arr) {
  return R.mergeAll(arr);
}

/**
 * 根据列表构建树
 * @param {*} list 列表
 * @param {*} rootNode 根节点
 */
export function buildTree(list, rootNode) {
  // 定义根节点
  findChild(rootNode, list);

  return rootNode;
}

/**
 * 递归查找子节点
 */
function findChild(node, list) {
  const curNode = node;
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].parentId === curNode.id) {
      // 判断是否存在children
      if (!Object.prototype.hasOwnProperty.call(curNode, 'children')) {
        curNode.children = [];
      }

      const newNode = { ...list[i] };
      curNode.children.push(newNode);
      findChild(newNode, list);
    }
  }
};

/**
 * 获取站点前缀
 */
export const getSitePrefix = () => {
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
};

/**
 * 是否是线上环境
 */
export const isProd = () => /mama\.dxy\.com/i.test(window.location.host);

/**
 * 通过路由判断当前后台是商桥系统还是管理后台
 */

export function getSystemType() {
  const match = /^\/(system|manage)((?=\/)|$)/.exec(location.pathname);

  if (match) {
    return match[1];
  }
}

/**
 * 返回后台名称
 */

export function getSystemTitle() {
  const SystemTitleMap = {
    system: '商桥系统',
    manage: '管理后台',
  };
  const type = getSystemType();

  return SystemTitleMap[type] || '';
}

/**
 * 跟多个 path 获取经过的所有菜单树路径节点
 *
 */
export const getMenuTreePath = (keys, treeData, haveCurNode = false, isObject = false) => {
  let result = [];

  function find(key, tree, path) {
    tree.forEach(e => {
      if (e.path === key) {
        // 找到目标
        result = haveCurNode ?
          [...result, ...path, isObject ? { path: e.path, name: e.name } : e.path]
          : [...result, ...path];
      } else if (e.children && e.children.length > 0) {
        find(key, e.children, [...path, isObject ? { path: e.path, name: e.name } : e.path]);
      }
    });
  }

  keys.forEach(i => {
    find(i, treeData, []);
  });
  return [...new Set(result)];
};

/**
 * 将数字通过二进制转换成素组
 * 9 => [1, 8]
 * 7 => [1, 2, 4]
 * 5 => [1, 4]
 * 3 => [1, 2]
 * @param {Number} decNumber
 */
export function convertToDecimalArrayByBinary(decNumber) {
  const num = Number(decNumber);

  if (Number.isNaN(num) || num < 0) return [];

  return num.toString(2).split('').reverse().reduce((prev, next, index) => {
    return next === '1' ? [...prev, 2 ** index] : prev;
  }, []);
}

/**
 * 转义字符串中的符号，用于正则匹配
 * @param {string} str 字符串
 */
export function regStr(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
