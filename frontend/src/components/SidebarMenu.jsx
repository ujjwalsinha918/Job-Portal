import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";

/**
 * ✅ Reusable Sidebar Component
 *
 * @param {Array} items - menu items in this format:
 * [
 *   { label: "Profile", path: "/jobseeker/profile" },
 *   { 
 *     label: "Charts", 
 *     submenu: [
 *       { label: "Pie Chart", path: "/charts/pie" },
 *       { label: "Line Chart", path: "/charts/line" }
 *     ] 
 *   }
 * ]
 *
 * This component handles both:
 * - Simple menu items (with direct `path`)
 * - Nested submenu items (with `submenu`)
 */
export default function SidebarMenu({ items }) {
  return (
    // Sidebar wrapper from react-pro-sidebar
    <Sidebar>
      {/* Menu container */}
      <Menu>
        {items.map((item, index) =>
          // If the item has a submenu → render a collapsible SubMenu
          item.submenu ? (
            <SubMenu key={index} label={item.label}>
              {item.submenu.map((sub, i) => (
                // Each submenu item links to its route
                <MenuItem key={i} component={<Link to={sub.path} />}>
                  {sub.label}
                </MenuItem>
              ))}
            </SubMenu>
          ) : (
            // Otherwise → render a simple MenuItem
            <MenuItem key={index} component={<Link to={item.path} />}>
              {item.label}
            </MenuItem>
          )
        )}
      </Menu>
    </Sidebar>
  );
}
