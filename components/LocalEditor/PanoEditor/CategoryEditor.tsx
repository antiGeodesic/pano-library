import React, { useState, useCallback, useEffect } from 'react';
import categories from '@/data/categories.json';
import { TagCategory } from '@/types/index';
import { TagStructure } from '@/types/LocalEditor';
import styles from '@/styles/categories.module.css';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';

const CategoryEditor: React.FC = () => {
  const tagsData: TagStructure[] = categories;
  const {
    currentPanorama,
    setCurrentTags
  } = useLocalEditorContext();
  
  const [activeCategories, setActiveCategories] = useState<TagCategory[]>(
    currentPanorama?.tags ?? []
  );
  
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<number | null>(null);
  
  useEffect(() => {
    if (currentPanorama) {
      setActiveCategories(currentPanorama.tags || []);
    }
  }, [currentPanorama]);

  const exists = useCallback((x: number, y: number, z: number, t: string): boolean => {
    const existing = activeCategories.find(c => 
      c.x === x && c.y === y && c.z === z && c.t === t
    );
    return !!existing;
  }, [activeCategories]);

  if (!currentPanorama) return null;

  const handleClick = (x: number, y: number, z: number, t: string) => {
    const newActiveCategories = exists(x, y, z, t)
      ? activeCategories.filter(c => !(c.x === x && c.y === y && c.z === z && c.t === t))
      : [...activeCategories, { x, y, z, t }];
    
    setActiveCategories(newActiveCategories);
    setCurrentTags(newActiveCategories);
    console.log(`category: ${x}, subCategory: ${y}, sub-subCategory: ${z}`);
  };

  const defaultTag = '';

  // Get the subcategories for the hovered category
  const currentSubCategories = hoveredCategory !== null 
    ? tagsData[hoveredCategory]?.subCategories || [] 
    : [];

  // Get the sub-subcategories for the hovered subcategory
  const currentSubSubCategories = (hoveredCategory !== null && hoveredSubCategory !== null)
    ? tagsData[hoveredCategory]?.subCategories[hoveredSubCategory]?.subSubCategories || []
    : [];

  return (
    <div className={styles.categoryEditor}>
      <div className={styles.hierarchicalNavigation}>
        {/* First column - Categories */}
        <div className={styles.navColumn}>
          <h3 className={styles.columnHeader}>Categories</h3>
          <ul className={styles.navList}>
            {tagsData.map((cat) => (
              <li 
                key={cat.index}
                className={`${styles.navItem} ${hoveredCategory === cat.index ? styles.navItemActive : ''}`}
                onMouseEnter={() => setHoveredCategory(cat.index)}
              >
                {cat.category}
              </li>
            ))}
          </ul>
        </div>

        {/* Second column - SubCategories */}
        {hoveredCategory !== null && (
          <div className={styles.navColumn}>
            <h3 className={styles.columnHeader}>
              {hoveredCategory !== null ? tagsData[hoveredCategory]?.category : ''} Subcategories
            </h3>
            <ul className={styles.navList}>
              {currentSubCategories.map((subCat) => (
                <li 
                  key={subCat.index}
                  className={`${styles.navItem} ${hoveredSubCategory === subCat.index ? styles.navItemActive : ''}`}
                  onMouseEnter={() => setHoveredSubCategory(subCat.index)}
                >
                  {subCat.subCategory}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Third column - SubSubCategories */}
        {hoveredCategory !== null && hoveredSubCategory !== null && (
          <div className={styles.navColumn}>
            <h3 className={styles.columnHeader}>
              {hoveredSubCategory !== null && currentSubCategories[hoveredSubCategory]?.subCategory} Items
            </h3>
            <ul className={styles.navList}>
              {currentSubSubCategories.map((subSubCat) => (
                <li 
                  key={subSubCat.index}
                  className={`${styles.navItem} ${
                    exists(
                      hoveredCategory,
                      hoveredSubCategory,
                      subSubCat.index,
                      defaultTag
                    ) ? styles.navItemSelected : ''
                  }`}
                  onClick={() => handleClick(
                    hoveredCategory,
                    hoveredSubCategory,
                    subSubCat.index,
                    defaultTag
                  )}
                >
                  {subSubCat.subSubCategory}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryEditor;


/*
import React, { useState, useCallback, useEffect } from 'react';
import categories from '@/data/categories.json';
import { TagStructure, TagCategory } from '@/types';
import styles from '@/styles/categories.module.css';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';

const CategoryEditor: React.FC = () => {
  const tagsData: TagStructure[] = categories;
  const {
    currentPanorama,
    setCurrentTags
  } = useLocalEditorContext();
  
  const [activeCategories, setActiveCategories] = useState<TagCategory[]>(
    currentPanorama?.tags ?? []
  );
  
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<number | null>(null);
  
  useEffect(() => {
    if (currentPanorama) {
      setActiveCategories(currentPanorama.tags || []);
    }
  }, [currentPanorama]);

  const exists = useCallback((x: number, y: number, z: number, t: string): boolean => {
    const existing = activeCategories.find(c => 
      c.x === x && c.y === y && c.z === z && c.t === t
    );
    return !!existing;
  }, [activeCategories]);

  if (!currentPanorama) return null;

  const handleClick = (x: number, y: number, z: number, t: string) => {
    const newActiveCategories = exists(x, y, z, t)
      ? activeCategories.filter(c => !(c.x === x && c.y === y && c.z === z && c.t === t))
      : [...activeCategories, { x, y, z, t }];
    
    setActiveCategories(newActiveCategories);
    setCurrentTags(newActiveCategories);
    console.log(`category: ${x}, subCategory: ${y}, sub-subCategory: ${z}`);
  };

  const defaultTag = '';

  // Get selected items for each category
  const getSelectedItemsForCategory = (categoryIndex: number) => {
    return activeCategories.filter(tag => tag.x === categoryIndex);
  };

  // Function to get subcategory name by index
  const getSubCategoryName = (catIndex: number, subCatIndex: number) => {
    const cat = tagsData.find(c => c.index === catIndex);
    if (!cat) return "Unknown";
    
    const subCat = cat.subCategories.find(sc => sc.index === subCatIndex);
    return subCat ? subCat.subCategory : "Unknown";
  };

  // Function to get sub-subcategory name by index
  const getSubSubCategoryName = (catIndex: number, subCatIndex: number, subSubCatIndex: number) => {
    const cat = tagsData.find(c => c.index === catIndex);
    if (!cat) return "Unknown";
    
    const subCat = cat.subCategories.find(sc => sc.index === subCatIndex);
    if (!subCat) return "Unknown";
    
    const subSubCat = subCat.subSubCategories.find(ssc => ssc.index === subSubCatIndex);
    return subSubCat ? subSubCat.subSubCategory : "Unknown";
  };

  // Get the subcategories for the hovered category
  const currentSubCategories = hoveredCategory !== null 
    ? tagsData[hoveredCategory]?.subCategories || [] 
    : [];

  // Get the sub-subcategories for the hovered subcategory
  const currentSubSubCategories = (hoveredCategory !== null && hoveredSubCategory !== null)
    ? tagsData[hoveredCategory]?.subCategories[hoveredSubCategory]?.subSubCategories || []
    : [];

  return (
    <div className={styles.categoryEditor}>
      <div className={styles.hierarchicalNavigation}>

        <div className={styles.navColumn}>
          <h3 className={styles.columnHeader}>Categories</h3>
          <ul className={styles.navList}>
            {tagsData.map((cat) => (
              <li 
                key={cat.index}
                className={styles.categoryContainer}
              >
                <div 
                  className={`${styles.navItem} ${hoveredCategory === cat.index ? styles.navItemActive : ''}`}
                  onMouseEnter={() => {
                    setHoveredCategory(cat.index);
                    setHoveredSubCategory(null);
                  }}
                >
                  {cat.category}
                </div>


                {getSelectedItemsForCategory(cat.index).length > 0 && (
                  <div className={styles.selectedItemsContainer}>
                    <h4 className={styles.selectedItemsHeader}>Selected Items:</h4>
                    <ul className={styles.selectedItemsList}>
                      {getSelectedItemsForCategory(cat.index).map((tag, idx) => (
                        <li 
                          key={idx} 
                          className={styles.selectedItem}
                          onClick={() => handleClick(tag.x, tag.y, tag.z, tag.t)}
                        >
                          <span className={styles.selectedItemPath}>
                            {getSubCategoryName(tag.x, tag.y)} › {getSubSubCategoryName(tag.x, tag.y, tag.z)}
                          </span>
                          <span className={styles.removeIcon}>×</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>


        {hoveredCategory !== null && (
          <div className={styles.navColumn}>
            <h3 className={styles.columnHeader}>
              {hoveredCategory !== null ? tagsData[hoveredCategory]?.category : ''} Subcategories
            </h3>
            <ul className={styles.navList}>
              {currentSubCategories.map((subCat) => (
                <li 
                  key={subCat.index}
                  className={styles.categoryContainer}
                >
                  <div 
                    className={`${styles.navItem} ${hoveredSubCategory === subCat.index ? styles.navItemActive : ''}`}
                    onMouseEnter={() => setHoveredSubCategory(subCat.index)}
                  >
                    {subCat.subCategory}
                  </div>
                  

                  {activeCategories.some(tag => 
                    tag.x === hoveredCategory && 
                    tag.y === subCat.index
                  ) && (
                    <div className={styles.selectedItemsContainer}>
                      <h4 className={styles.selectedItemsHeader}>Selected Items:</h4>
                      <ul className={styles.selectedItemsList}>
                        {activeCategories
                          .filter(tag => tag.x === hoveredCategory && tag.y === subCat.index)
                          .map((tag, idx) => (
                            <li 
                              key={idx} 
                              className={styles.selectedItem}
                              onClick={() => handleClick(tag.x, tag.y, tag.z, tag.t)}
                            >
                              <span className={styles.selectedItemPath}>
                                {getSubSubCategoryName(tag.x, tag.y, tag.z)}
                              </span>
                              <span className={styles.removeIcon}>×</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}


        {hoveredCategory !== null && hoveredSubCategory !== null && (
          <div className={styles.navColumn}>
            <h3 className={styles.columnHeader}>
              {hoveredSubCategory !== null && currentSubCategories[hoveredSubCategory]?.subCategory} Items
            </h3>
            <ul className={styles.navList}>
              {currentSubSubCategories.map((subSubCat) => (
                <li 
                  key={subSubCat.index}
                  className={`${styles.navItem} ${
                    exists(
                      hoveredCategory,
                      hoveredSubCategory,
                      subSubCat.index,
                      defaultTag
                    ) ? styles.navItemSelected : ''
                  }`}
                  onClick={() => handleClick(
                    hoveredCategory,
                    hoveredSubCategory,
                    subSubCat.index,
                    defaultTag
                  )}
                >
                  {subSubCat.subSubCategory}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryEditor;*/









/*
import React, { useState, useCallback, useEffect } from 'react';
import categories from '@/data/categories.json';
import { TagStructure, TagCategory } from '@/types';
import styles from '@/styles/categories.module.css';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';

const CategoryEditor: React.FC = () => {
  const tagsData: TagStructure[] = categories;
  const {
    currentPanorama,
    setCurrentTags
  } = useLocalEditorContext();
  
  const [activeCategories, setActiveCategories] = useState<TagCategory[]>(
    currentPanorama?.tags ?? []
  );
  
  // Track which categories and subcategories are expanded
  const [expandedCategories, setExpandedCategories] = useState<{[key: number]: boolean}>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    if (currentPanorama) {
      setActiveCategories(currentPanorama.tags || []);
      
      // Auto-expand categories and subcategories with active selections
      const newExpandedCategories: {[key: number]: boolean} = {};
      const newExpandedSubCategories: {[key: string]: boolean} = {};
      
      currentPanorama.tags?.forEach(tag => {
        newExpandedCategories[tag.x] = true;
        newExpandedSubCategories[`${tag.x}-${tag.y}`] = true;
      });
      
      setExpandedCategories(newExpandedCategories);
      setExpandedSubCategories(newExpandedSubCategories);
    }
  }, [currentPanorama]);

  const exists = useCallback((x: number, y: number, z: number, t: string): boolean => {
    return activeCategories.some(c => 
      c.x === x && c.y === y && c.z === z && c.t === t
    );
  }, [activeCategories]);

  if (!currentPanorama) return null;

  const handleClick = (x: number, y: number, z: number, t: string) => {
    const newActiveCategories = exists(x, y, z, t)
      ? activeCategories.filter(c => !(c.x === x && c.y === y && c.z === z && c.t === t))
      : [...activeCategories, { x, y, z, t }];
    
    setActiveCategories(newActiveCategories);
    setCurrentTags(newActiveCategories);
    
    // Ensure parent categories stay expanded when selecting
    setExpandedCategories({...expandedCategories, [x]: true});
    setExpandedSubCategories({...expandedSubCategories, [`${x}-${y}`]: true});
    
    console.log(`category: ${x}, subCategory: ${y}, sub-subCategory: ${z}`);
  };

  const toggleCategoryExpansion = (categoryIndex: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const toggleSubCategoryExpansion = (categoryIndex: number, subCategoryIndex: number) => {
    const key = `${categoryIndex}-${subCategoryIndex}`;
    setExpandedSubCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if any subSubCategory in this category has been selected
  const hasCategorySelection = (catIndex: number): boolean => {
    return activeCategories.some(cat => cat.x === catIndex);
  };

  // Check if any subSubCategory in this subcategory has been selected
  const hasSubCategorySelection = (catIndex: number, subCatIndex: number): boolean => {
    return activeCategories.some(cat => cat.x === catIndex && cat.y === subCatIndex);
  };

  const defaultTag = '';

  return (
    <div className={styles.categoryEditor}>
      <div className={styles.hierarchicalNavigation}>

        <div className={styles.navColumn}>
          <h3 className={styles.columnHeader}>Categories</h3>
          <ul className={styles.navList}>
            {tagsData.map((cat) => (
              <li 
                key={cat.index}
                className={`${styles.navItem} ${
                  expandedCategories[cat.index] ? styles.navItemExpanded : ''
                } ${
                  hasCategorySelection(cat.index) ? styles.navItemWithSelection : ''
                }`}
                onClick={() => toggleCategoryExpansion(cat.index)}
              >
                <div className={styles.navItemHeader}>
                  <span className={styles.expandIcon}>
                    {expandedCategories[cat.index] ? '▼' : '►'}
                  </span>
                  <span>{cat.category}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>


        <div className={styles.navColumnsContainer}>
          {tagsData.map((cat) => (
            expandedCategories[cat.index] && (
              <div key={`sub-${cat.index}`} className={styles.navColumnGroup}>
                <div className={styles.navColumn}>
                  <h3 className={styles.columnHeader}>
                    {cat.category} Subcategories
                  </h3>
                  <ul className={styles.navList}>
                    {cat.subCategories.map((subCat) => (
                      <li 
                        key={subCat.index}
                        className={`${styles.navItem} ${
                          expandedSubCategories[`${cat.index}-${subCat.index}`] ? styles.navItemExpanded : ''
                        } ${
                          hasSubCategorySelection(cat.index, subCat.index) ? styles.navItemWithSelection : ''
                        }`}
                        onClick={() => toggleSubCategoryExpansion(cat.index, subCat.index)}
                      >
                        <div className={styles.navItemHeader}>
                          <span className={styles.expandIcon}>
                            {expandedSubCategories[`${cat.index}-${subCat.index}`] ? '▼' : '►'}
                          </span>
                          <span>{subCat.subCategory}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>


                {cat.subCategories.map((subCat) => (
                  expandedSubCategories[`${cat.index}-${subCat.index}`] && (
                    <div key={`subsub-${cat.index}-${subCat.index}`} className={styles.navColumn}>
                      <h3 className={styles.columnHeader}>
                        {subCat.subCategory} Items
                      </h3>
                      <ul className={styles.navList}>
                        {subCat.subSubCategories.map((subSubCat) => (
                          <li 
                            key={subSubCat.index}
                            className={`${styles.navItem} ${
                              exists(
                                cat.index,
                                subCat.index,
                                subSubCat.index,
                                defaultTag
                              ) ? styles.navItemSelected : ''
                            }`}
                            onClick={() => handleClick(
                              cat.index,
                              subCat.index,
                              subSubCat.index,
                              defaultTag
                            )}
                          >
                            {subSubCat.subSubCategory}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;

*/







/*
import React, { useState, useCallback, useEffect } from 'react';
import categories from '@/data/categories.json';
import { TagStructure, TagCategory } from '@/types';
import styles from '@/styles/categories.module.css';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';

const CategoryEditor: React.FC = () => {
  const tagsData: TagStructure[] = categories;
  const {
    currentPanorama,
    setCurrentTags
  } = useLocalEditorContext();

  const [activeCategories, setActiveCategories] = useState<TagCategory[]>(
    currentPanorama?.tags ?? []
  );

  // Track which categories and subcategories are expanded
  const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (currentPanorama) {
      setActiveCategories(currentPanorama.tags || []);

      // Auto-expand categories and subcategories with active selections
      const newExpandedCategories: { [key: number]: boolean } = {};
      const newExpandedSubCategories: { [key: string]: boolean } = {};

      currentPanorama.tags?.forEach(tag => {
        newExpandedCategories[tag.x] = true;
        newExpandedSubCategories[`${tag.x}-${tag.y}`] = true;
      });

      setExpandedCategories(newExpandedCategories);
      setExpandedSubCategories(newExpandedSubCategories);
    }
  }, [currentPanorama]);

  const exists = useCallback((x: number, y: number, z: number, t: string): boolean => {
    return activeCategories.some(c =>
      c.x === x && c.y === y && c.z === z && c.t === t
    );
  }, [activeCategories]);

  if (!currentPanorama) return null;

  const handleClick = (x: number, y: number, z: number, t: string) => {
    const newActiveCategories = exists(x, y, z, t)
      ? activeCategories.filter(c => !(c.x === x && c.y === y && c.z === z && c.t === t))
      : [...activeCategories, { x, y, z, t }];

    setActiveCategories(newActiveCategories);
    setCurrentTags(newActiveCategories);

    // Ensure parent categories stay expanded when selecting
    setExpandedCategories({ ...expandedCategories, [x]: true });
    setExpandedSubCategories({ ...expandedSubCategories, [`${x}-${y}`]: true });

    console.log(`category: ${x}, subCategory: ${y}, sub-subCategory: ${z}`);
  };

  const toggleCategoryExpansion = (categoryIndex: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const toggleSubCategoryExpansion = (categoryIndex: number, subCategoryIndex: number) => {
    const key = `${categoryIndex}-${subCategoryIndex}`;
    setExpandedSubCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if any subSubCategory in this category has been selected
  const hasCategorySelection = (catIndex: number): boolean => {
    return activeCategories.some(cat => cat.x === catIndex);
  };

  // Check if any subSubCategory in this subcategory has been selected
  const hasSubCategorySelection = (catIndex: number, subCatIndex: number): boolean => {
    return activeCategories.some(cat => cat.x === catIndex && cat.y === subCatIndex);
  };
  const hasSubSubCategorySelection = (catIndex: number, subCatIndex: number, subSubCatIndex: number): boolean => {
    return activeCategories.some(cat => cat.x === catIndex && cat.y === subCatIndex && cat.z == subSubCatIndex);
  };
  const defaultTag = '';

  return (
    <div className={styles.categoryEditor}>
      <div className={styles.hierarchicalNavigation}>

        <div className={styles.navColumn}>
          <h3 className={styles.columnHeader}>Categories</h3>
          <ul className={styles.navList}>
            {tagsData.map((cat) => (
              <li
                key={cat.index}
                className={styles.category}
                onPointerEnter={() => toggleCategoryExpansion(cat.index)}
                  onPointerLeave={() => toggleCategoryExpansion(cat.index)}
              >
                <div
                  className={`${styles.navItem} ${expandedCategories[cat.index] ? styles.navItemExpanded : ''
                    } ${hasCategorySelection(cat.index) ? styles.navItemWithSelection : ''
                    }`}
                  onClick={() => toggleCategoryExpansion(cat.index)}
                  
                >
                  <div className={styles.navItemHeader}>
                    <span className={styles.expandIcon}>
                      {expandedCategories[cat.index] ? '▼' : '►'}
                    </span>
                    <span>{cat.category}</span>
                  </div>
                </div>
                <div style={{ backgroundColor: 'red' }}>
                  {(expandedCategories[cat.index] || hasCategorySelection(cat.index)) && (
                    <div key={`sub-${cat.index}`} className={styles.navColumnGroup}>
                      <div className={styles.navColumn}>
 
                        <ul className={styles.navList}>
                          {cat.subCategories.map((subCat) => (expandedCategories[cat.index] || hasSubCategorySelection(cat.index, subCat.index)) && (
                            <li
                              key={subCat.index}
                              className={styles.subCategory}
                            >
                              <div
                                className={`${styles.navItem} ${expandedSubCategories[`${cat.index}-${subCat.index}`] ? styles.navItemExpanded : ''
                                  } ${hasSubCategorySelection(cat.index, subCat.index) ? styles.navItemWithSelection : ''
                                  }`}
                                onClick={() => toggleSubCategoryExpansion(cat.index, subCat.index)}
                              >
                                <div className={styles.navItemHeader}>
                                  <span className={styles.expandIcon}>
                                    {expandedSubCategories[`${cat.index}-${subCat.index}`] ? '▼' : '►'}
                                  </span>
                                  <span>{subCat.subCategory}</span>
                                </div>
                              </div>
                              <div style={{ backgroundColor: 'yellow' }}>
                                {
                                  (expandedSubCategories[`${cat.index}-${subCat.index}`] || hasSubCategorySelection(cat.index, subCat.index)) && (
                                    <div key={`subsub-${cat.index}-${subCat.index}`} className={styles.navColumn}>
  
                                      <ul className={styles.navList}>
                                        {subCat.subSubCategories.map((subSubCat) => (expandedSubCategories[`${cat.index}-${subCat.index}`] || hasSubSubCategorySelection(cat.index, subCat.index, subSubCat.index)) && (
                                          <li
                                            key={subSubCat.index}
                                            className={`${styles.navItem} ${exists(
                                              cat.index,
                                              subCat.index,
                                              subSubCat.index,
                                              defaultTag
                                            ) ? styles.navItemSelected : ''
                                              }`}
                                            onClick={() => handleClick(
                                              cat.index,
                                              subCat.index,
                                              subSubCat.index,
                                              defaultTag
                                            )}
                                          >
                                            {subSubCat.subSubCategory}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )

                                }

                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>



                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>


        
      </div>
    </div>
  );
};

export default CategoryEditor;*/