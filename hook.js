// 打印进程信息（调试用）
console.log("进程架构:", Process.arch);
console.log("指针大小:", Process.pointerSize);

// 获取模块基址
const moduleName = "BaldrSky.exe";
const moduleBase = Module.findBaseAddress(moduleName);

if (!moduleBase) {
    // 如果找不到模块，尝试等待模块加载
    Module.ensureInitialized(moduleName);
    moduleBase = Module.findBaseAddress(moduleName);
    if (!moduleBase) {
        console.error("[!] 致命错误：无法定位模块");
        throw new Error("Module not found");
    }
}

// 计算目标地址（假设偏移量0x158D71）
const hookOffset = 0x158D71;      // 需要确认的实际偏移
const targetAddress = moduleBase.add(hookOffset);

// 打印调试信息
console.log(`[+] 模块基址: ${moduleBase}`);
console.log(`[+] Hook地址: ${targetAddress}`);

Interceptor.attach(targetAddress, {
    onEnter: function (args) {
        // 获取寄存器值
        const esi = this.context.esi;
        const edi = this.context.edi;


        // 计算检查地址 hp
        const Addr = esi.add(0x1564);
        const checkValue = Memory.readU32(Addr);

        // 调试输出
        console.log(`[DEBUG] ESI: ${esi}, Value: ${checkValue}`);

        if (checkValue !== 1000) {
            // 计算修改地址 [esi + 0x1564]
            const modifyAddr = esi.add(0x1564);
            const originalValue = Memory.readU32(modifyAddr);
            console.log(`生命值： ${originalValue}`)
            const newValue = originalValue - (edi * 100) >>> 0;

            // 范围检查
            if (newValue > 0xFFFFFFFF) {
                console.error(`[!] 溢出值: ${newValue} @ ${modifyAddress}`);
                return;
            }

            // 执行修改并跳过原指令
            Memory.writeU32(modifyAddr, newValue);
            console.log(`[+] 已修改内存 ${modifyAddr}: ${originalValue} -> ${newValue}`);
        } else {
            // 新逻辑：修改EDI寄存器但不跳过指令
            console.log(`[+] 触发特殊条件 重置EDI`);

            // 保存原始EDI值（如果需要恢复）
            const originalEdi = this.context.edi;

            // 修改EDI寄存器值为0
            this.context.edi = 0;

            // 注意：这里不修改eip，让原始指令继续执行
            // 原指令将执行 sub [esi+1564], edi（此时edi=0）

            // 调试输出
            console.log(`[DEBUG] 原始EDI: ${originalEdi} → 新EDI: 0`);
        }

    }
});