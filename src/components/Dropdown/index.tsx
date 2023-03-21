import { Menu, Transition } from "@headlessui/react";
import { ButtonHTMLAttributes, Fragment } from "react";
import { cx } from "src/utils/misc";

interface IItem {
  label: string;
  Icon?: React.ReactNode;
  onClick:() => any
}
export interface IDropdown extends ButtonHTMLAttributes<HTMLButtonElement> {
  items: IItem[];
  children: React.ReactNode;
  itemsClass?: string;
  itemsActiveClass?: string;
  itemsDisabledClass?: string;
}
export default function Dropdown({
  items,
  children,
  itemsClass = "",
  itemsActiveClass = "",
  itemsDisabledClass = "",
}: IDropdown) {
  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center ">
            {children}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {items?.length > 0 &&
                items.map(({ label, Icon, ...rest }, index) => {
                  return (
                    <Menu.Item key={`menu-item-${label}-${index}`}>
                      {({ active }) => (
                        <button
                          className={cx([
                            `group flex w-full items-center rounded-md px-2 py-2 text-sm ${itemsClass}`,
                            [
                              `bg-primary text-white ${itemsActiveClass}`,
                              active,
                            ],
                            [`text-gray-900 ${itemsDisabledClass}`, !active],
                          ])}
                          {...rest}
                        >
                          {Icon && Icon}
                          {label}
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
