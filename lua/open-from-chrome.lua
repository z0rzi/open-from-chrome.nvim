local M = {
  config = {}
}

-- Gets the path of the plugin directory. Usually `~/.local/share/nvim/lazy/open-from-chrome.nvim/`
function M.get_plugin_path()
  local path = debug.getinfo(1, "S").source:sub(2)
  return path:match("(.*/)")
end

-- Gets the path of the server typescript script.
local function get_server_script_path()
  local dir_path = M.get_plugin_path()
  -- if there is no executable or bun_executable in the config, we will use the shipped bun executable
  local bun_path = string.format("%s ", vim.fn.exepath("bun") or "")
  return string.format("%s%sserver/index.ts ", bun_path, dir_path)
end

-- Runs the server script with the given arguments.
function M.run_server_script(args)
  local path = get_server_script_path()

  local command = path .. args

  local handle = io.popen(command)
  local result = handle:read("*a")
  handle:close()

  return result
end

function M.setup(user_opts)
  M.config = vim.tbl_extend("force", M.config, user_opts or {})

  M.run_server_script('start')

  -- When vim closes, we should stop the server
  vim.cmd([[autocmd VimLeave * lua require('open-from-chrome').run_server_script('stop')]])
end

return M
