import React from 'react';
import Checkbox from './checkbox';

const CheckboxGroup = ({
  options,
  selected,
  onChange,
  isNested = false,
  getParentKey = (parent) => {
    return parent.parentKey;
  },
  getChildren = (parent) => {
    return parent.children || [];
  },
  getChildKey = (child, parent) => {
    return `${getParentKey(parent)}:${child}`;
  },
  labelRenderer = (val) => {
    return val;
  }
}) => {
  const getParentState = (parent) => {
    const children = getChildren(parent);
    const checkedChildren = children.filter(
      (child) => {
        return selected[getChildKey(child, parent)];
      }
    ).length;
    if (checkedChildren === 0) {
      return 'unchecked';
    }
    if (checkedChildren === children.length) {
      return 'checked';
    }
    return 'mixed';
  };

  return (
    <div>
      {isNested
        ? options.map((parent) => {
            const parentKey = getParentKey(parent);
            const parentState = getParentState(parent);
            const parentId = `parent-${parentKey}`;
            return (
              <div key={parentKey} style={{ marginBottom: 16 }}>
                <Checkbox
                  id={parentId}
                  checked={parentState === 'checked'}
                  indeterminate={parentState === 'mixed'}
                  onChange={() => {
                    const shouldCheck = parentState !== 'checked';
                    onChange(parentKey, null, shouldCheck);
                  }}
                  label={labelRenderer(parent)}
                  isParent={true}
                />
                <div style={{ marginLeft: 24 }}>
                  {getChildren(parent).map((child) => {
                    const childKey = getChildKey(child, parent);
                    const childId = `child-${parentKey}-${child}`;
                    return (
                      <Checkbox
                        key={childKey}
                        id={childId}
                        checked={selected[childKey] || false}
                        onChange={() => {
                          onChange(parentKey, child);
                        }}
                        label={labelRenderer(child, parent)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        : options.map((option) => {
            const optionId = `option-${option}`;
            return (
              <Checkbox
                key={option}
                id={optionId}
                checked={selected[option] || false}
                onChange={() => {
                  onChange(option);
                }}
                label={labelRenderer(option)}
              />
            );
          })}
    </div>
  );
};

export default CheckboxGroup;
