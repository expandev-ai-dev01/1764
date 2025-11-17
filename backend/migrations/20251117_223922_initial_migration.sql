/**
 * Database Migration
 * Generated: 2025-11-17T22:39:22.890Z
 * Timestamp: 20251117_223922
 *
 * This migration includes:
 * - Schema structures (tables, indexes, constraints)
 * - Initial data
 * - Stored procedures
 *
 * Note: This file is automatically executed by the migration runner
 * on application startup in Azure App Service.
 */

-- Set options for better SQL Server compatibility
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ANSI_WARNINGS ON;
SET NUMERIC_ROUNDABORT OFF;
GO

PRINT 'Starting database migration...';
PRINT 'Timestamp: 20251117_223922';
GO


-- ============================================
-- STORED PROCEDURES
-- Database stored procedures and functions
-- ============================================

-- File: 001_create_schema.sql
/**
 * @schema functional
 * Business logic schema for StockBox inventory management
 */
CREATE SCHEMA [functional];
GO

/**
 * @table movimentacao Stock movement transactions table
 * @multitenancy true
 * @softDelete false
 * @alias mov
 */
CREATE TABLE [functional].[movimentacao] (
  [idMovimentacao] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [tipoMovimentacao] VARCHAR(20) NOT NULL,
  [idProduto] INTEGER NOT NULL,
  [quantidade] NUMERIC(15, 2) NOT NULL,
  [dataHora] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [idUsuario] INTEGER NOT NULL,
  [motivo] NVARCHAR(255) NOT NULL,
  [observacao] NVARCHAR(1000) NULL,
  [numeroNotaFiscal] VARCHAR(9) NULL,
  [idLocalizacao] INTEGER NULL,
  [custoUnitario] NUMERIC(18, 6) NULL,
  [lote] NVARCHAR(50) NULL,
  [dataValidade] DATE NULL
);
GO

/**
 * @table produto Product master table
 * @multitenancy true
 * @softDelete true
 * @alias prd
 */
CREATE TABLE [functional].[produto] (
  [idProduto] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [nome] NVARCHAR(100) NOT NULL,
  [descricao] NVARCHAR(500) NOT NULL DEFAULT (''),
  [estoqueMinimo] NUMERIC(15, 2) NOT NULL DEFAULT (0),
  [estoqueMaximo] NUMERIC(15, 2) NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [dateModified] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table saldoEstoque Current stock balance table
 * @multitenancy true
 * @softDelete false
 * @alias sld
 */
CREATE TABLE [functional].[saldoEstoque] (
  [idSaldoEstoque] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idProduto] INTEGER NOT NULL,
  [quantidadeAtual] NUMERIC(15, 2) NOT NULL DEFAULT (0),
  [valorMedio] NUMERIC(18, 6) NOT NULL DEFAULT (0),
  [valorTotal] NUMERIC(18, 6) NOT NULL DEFAULT (0),
  [ultimaMovimentacao] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [status] VARCHAR(20) NOT NULL DEFAULT ('normal'),
  [dateModified] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

/**
 * @primaryKey pkMovimentacao
 * @keyType Object
 */
ALTER TABLE [functional].[movimentacao]
ADD CONSTRAINT [pkMovimentacao] PRIMARY KEY CLUSTERED ([idMovimentacao]);
GO

/**
 * @primaryKey pkProduto
 * @keyType Object
 */
ALTER TABLE [functional].[produto]
ADD CONSTRAINT [pkProduto] PRIMARY KEY CLUSTERED ([idProduto]);
GO

/**
 * @primaryKey pkSaldoEstoque
 * @keyType Object
 */
ALTER TABLE [functional].[saldoEstoque]
ADD CONSTRAINT [pkSaldoEstoque] PRIMARY KEY CLUSTERED ([idSaldoEstoque]);
GO

/**
 * @foreignKey fkMovimentacao_Produto
 * @target functional.produto
 */
ALTER TABLE [functional].[movimentacao]
ADD CONSTRAINT [fkMovimentacao_Produto] FOREIGN KEY ([idProduto])
REFERENCES [functional].[produto]([idProduto]);
GO

/**
 * @foreignKey fkSaldoEstoque_Produto
 * @target functional.produto
 */
ALTER TABLE [functional].[saldoEstoque]
ADD CONSTRAINT [fkSaldoEstoque_Produto] FOREIGN KEY ([idProduto])
REFERENCES [functional].[produto]([idProduto]);
GO

/**
 * @check chkMovimentacao_TipoMovimentacao
 * @enum {entrada} Product entry into stock
 * @enum {saida} Product exit from stock
 * @enum {ajuste} Stock adjustment
 * @enum {criacao} Product creation
 * @enum {exclusao} Product deletion
 */
ALTER TABLE [functional].[movimentacao]
ADD CONSTRAINT [chkMovimentacao_TipoMovimentacao] CHECK ([tipoMovimentacao] IN ('entrada', 'saida', 'ajuste', 'criacao', 'exclusao'));
GO

/**
 * @check chkSaldoEstoque_Status
 * @enum {normal} Normal stock level
 * @enum {baixo} Low stock level
 * @enum {critico} Critical stock level
 * @enum {excesso} Excess stock level
 * @enum {zerado} Zero stock
 */
ALTER TABLE [functional].[saldoEstoque]
ADD CONSTRAINT [chkSaldoEstoque_Status] CHECK ([status] IN ('normal', 'baixo', 'critico', 'excesso', 'zerado'));
GO

/**
 * @index ixMovimentacao_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixMovimentacao_Account]
ON [functional].[movimentacao]([idAccount]);
GO

/**
 * @index ixMovimentacao_Produto
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixMovimentacao_Produto]
ON [functional].[movimentacao]([idAccount], [idProduto]);
GO

/**
 * @index ixMovimentacao_DataHora
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixMovimentacao_DataHora]
ON [functional].[movimentacao]([idAccount], [dataHora] DESC);
GO

/**
 * @index ixMovimentacao_TipoMovimentacao
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixMovimentacao_TipoMovimentacao]
ON [functional].[movimentacao]([idAccount], [tipoMovimentacao]);
GO

/**
 * @index ixMovimentacao_Usuario
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixMovimentacao_Usuario]
ON [functional].[movimentacao]([idAccount], [idUsuario]);
GO

/**
 * @index ixProduto_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixProduto_Account]
ON [functional].[produto]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index uqProduto_Account_Nome
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqProduto_Account_Nome]
ON [functional].[produto]([idAccount], [nome])
WHERE [deleted] = 0;
GO

/**
 * @index ixSaldoEstoque_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSaldoEstoque_Account]
ON [functional].[saldoEstoque]([idAccount]);
GO

/**
 * @index uqSaldoEstoque_Account_Produto
 * @type Performance
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqSaldoEstoque_Account_Produto]
ON [functional].[saldoEstoque]([idAccount], [idProduto]);
GO

/**
 * @index ixSaldoEstoque_Status
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixSaldoEstoque_Status]
ON [functional].[saldoEstoque]([idAccount], [status]);
GO

-- File: 002_stored_procedures.sql
/**
 * @summary
 * Creates a new stock movement transaction
 *
 * @procedure spMovimentacaoCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/movimentacao
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier
 *
 * @param {VARCHAR} tipoMovimentacao
 *   - Required: Yes
 *   - Description: Movement type (entrada, saida, ajuste, criacao, exclusao)
 *
 * @param {INT} idProduto
 *   - Required: Yes
 *   - Description: Product identifier
 *
 * @param {NUMERIC} quantidade
 *   - Required: Yes
 *   - Description: Quantity moved
 *
 * @param {NVARCHAR} motivo
 *   - Required: Yes
 *   - Description: Movement reason
 *
 * @param {NVARCHAR} observacao
 *   - Required: No
 *   - Description: Additional observations
 *
 * @param {VARCHAR} numeroNotaFiscal
 *   - Required: No
 *   - Description: Invoice number
 *
 * @param {INT} idLocalizacao
 *   - Required: No
 *   - Description: Location identifier
 *
 * @param {NUMERIC} custoUnitario
 *   - Required: No
 *   - Description: Unit cost
 *
 * @param {NVARCHAR} lote
 *   - Required: No
 *   - Description: Batch number
 *
 * @param {DATE} dataValidade
 *   - Required: No
 *   - Description: Expiration date
 *
 * @returns {INT} idMovimentacao - Created movement identifier
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Product validation failure
 * - Insufficient stock for saida
 * - Business rule validation for each movement type
 */
CREATE OR ALTER PROCEDURE [functional].[spMovimentacaoCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @tipoMovimentacao VARCHAR(20),
  @idProduto INTEGER,
  @quantidade NUMERIC(15, 2),
  @motivo NVARCHAR(255),
  @observacao NVARCHAR(1000) = NULL,
  @numeroNotaFiscal VARCHAR(9) = NULL,
  @idLocalizacao INTEGER = NULL,
  @custoUnitario NUMERIC(18, 6) = NULL,
  @lote NVARCHAR(50) = NULL,
  @dataValidade DATE = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF (@tipoMovimentacao IS NULL)
  BEGIN
    ;THROW 51000, 'tipoMovimentacaoRequired', 1;
  END;

  IF (@idProduto IS NULL)
  BEGIN
    ;THROW 51000, 'idProdutoRequired', 1;
  END;

  IF (@quantidade IS NULL)
  BEGIN
    ;THROW 51000, 'quantidadeRequired', 1;
  END;

  IF (@motivo IS NULL OR LEN(TRIM(@motivo)) = 0)
  BEGIN
    ;THROW 51000, 'motivoRequired', 1;
  END;

  /**
   * @validation Product existence validation
   * @throw {productDoesntExist}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[produto] [prd]
    WHERE [prd].[idProduto] = @idProduto
      AND [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  /**
   * @rule {fn-order-processing,db-business-rule-validation}
   * Business rule validation for movement types
   */
  IF (@tipoMovimentacao = 'entrada')
  BEGIN
    IF (@quantidade <= 0)
    BEGIN
      ;THROW 51000, 'quantityMustBePositiveForEntrada', 1;
    END;

    IF (@custoUnitario IS NULL OR @custoUnitario <= 0)
    BEGIN
      ;THROW 51000, 'custoUnitarioRequiredForEntrada', 1;
    END;
  END;

  IF (@tipoMovimentacao = 'saida')
  BEGIN
    IF (@quantidade >= 0)
    BEGIN
      ;THROW 51000, 'quantityMustBeNegativeForSaida', 1;
    END;

    DECLARE @quantidadeAtual NUMERIC(15, 2);
    SELECT @quantidadeAtual = [sld].[quantidadeAtual]
    FROM [functional].[saldoEstoque] [sld]
    WHERE [sld].[idAccount] = @idAccount
      AND [sld].[idProduto] = @idProduto;

    IF (@quantidadeAtual IS NULL OR (@quantidadeAtual + @quantidade) < 0)
    BEGIN
      ;THROW 51000, 'insufficientStock', 1;
    END;
  END;

  IF (@tipoMovimentacao = 'criacao')
  BEGIN
    IF (@quantidade <= 0)
    BEGIN
      ;THROW 51000, 'quantityMustBePositiveForCriacao', 1;
    END;

    IF (@custoUnitario IS NULL OR @custoUnitario <= 0)
    BEGIN
      ;THROW 51000, 'custoUnitarioRequiredForCriacao', 1;
    END;
  END;

  IF (@tipoMovimentacao = 'exclusao')
  BEGIN
    IF (@quantidade <> 0)
    BEGIN
      ;THROW 51000, 'quantityMustBeZeroForExclusao', 1;
    END;
  END;

  IF (@tipoMovimentacao IN ('ajuste', 'exclusao'))
  BEGIN
    IF (LEN(TRIM(@motivo)) < 10)
    BEGIN
      ;THROW 51000, 'motivoMustBeDetailedForAjusteOrExclusao', 1;
    END;
  END;

  IF (@dataValidade IS NOT NULL AND @dataValidade <= CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dataValidadeMustBeFuture', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

    DECLARE @idMovimentacao INTEGER;

    /**
     * @rule {fn-order-processing}
     * Insert movement transaction
     */
    INSERT INTO [functional].[movimentacao] (
      [idAccount],
      [tipoMovimentacao],
      [idProduto],
      [quantidade],
      [dataHora],
      [idUsuario],
      [motivo],
      [observacao],
      [numeroNotaFiscal],
      [idLocalizacao],
      [custoUnitario],
      [lote],
      [dataValidade]
    )
    VALUES (
      @idAccount,
      @tipoMovimentacao,
      @idProduto,
      @quantidade,
      GETUTCDATE(),
      @idUser,
      @motivo,
      @observacao,
      @numeroNotaFiscal,
      @idLocalizacao,
      @custoUnitario,
      @lote,
      @dataValidade
    );

    SET @idMovimentacao = SCOPE_IDENTITY();

    /**
     * @rule {fn-order-processing}
     * Recalculate stock balance
     */
    EXEC [functional].[spSaldoEstoqueRecalculate] @idAccount, @idProduto;

    /**
     * @output {MovimentacaoCreated, 1, 1}
     * @column {INT} idMovimentacao - Created movement identifier
     */
    SELECT @idMovimentacao AS [idMovimentacao];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Lists stock movements with filtering and pagination
 *
 * @procedure spMovimentacaoList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/movimentacao
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {DATE} periodoInicio - Start date filter
 * @param {DATE} periodoFim - End date filter
 * @param {VARCHAR} tipoMovimentacao - Movement type filter
 * @param {INT} idProduto - Product filter
 * @param {INT} idUsuario - User filter
 * @param {VARCHAR} ordenacao - Sort order
 * @param {INT} itensPorPagina - Items per page
 * @param {INT} paginaAtual - Current page
 *
 * @testScenarios
 * - List all movements without filters
 * - Filter by date range
 * - Filter by movement type
 * - Filter by product
 * - Pagination functionality
 */
CREATE OR ALTER PROCEDURE [functional].[spMovimentacaoList]
  @idAccount INTEGER,
  @periodoInicio DATE = NULL,
  @periodoFim DATE = NULL,
  @tipoMovimentacao VARCHAR(20) = NULL,
  @idProduto INTEGER = NULL,
  @idUsuario INTEGER = NULL,
  @ordenacao VARCHAR(20) = 'data_decrescente',
  @itensPorPagina INTEGER = 25,
  @paginaAtual INTEGER = 1
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@periodoFim IS NOT NULL AND @periodoInicio IS NOT NULL AND @periodoFim < @periodoInicio)
  BEGIN
    ;THROW 51000, 'periodoFimMustBeGreaterThanInicio', 1;
  END;

  IF (@paginaAtual < 1)
  BEGIN
    ;THROW 51000, 'paginaAtualMustBeGreaterThanZero', 1;
  END;

  DECLARE @offset INTEGER = (@paginaAtual - 1) * @itensPorPagina;

  /**
   * @output {MovimentacaoList, n, n}
   * @column {INT} idMovimentacao - Movement identifier
   * @column {VARCHAR} tipoMovimentacao - Movement type
   * @column {INT} idProduto - Product identifier
   * @column {NVARCHAR} nomeProduto - Product name
   * @column {NUMERIC} quantidade - Quantity moved
   * @column {DATETIME2} dataHora - Movement date and time
   * @column {INT} idUsuario - User identifier
   * @column {NVARCHAR} motivo - Movement reason
   * @column {NVARCHAR} observacao - Additional observations
   * @column {VARCHAR} numeroNotaFiscal - Invoice number
   * @column {NUMERIC} custoUnitario - Unit cost
   * @column {NVARCHAR} lote - Batch number
   * @column {DATE} dataValidade - Expiration date
   */
  SELECT
    [mov].[idMovimentacao],
    [mov].[tipoMovimentacao],
    [mov].[idProduto],
    [prd].[nome] AS [nomeProduto],
    [mov].[quantidade],
    [mov].[dataHora],
    [mov].[idUsuario],
    [mov].[motivo],
    [mov].[observacao],
    [mov].[numeroNotaFiscal],
    [mov].[custoUnitario],
    [mov].[lote],
    [mov].[dataValidade]
  FROM [functional].[movimentacao] [mov]
    JOIN [functional].[produto] [prd] ON ([prd].[idAccount] = [mov].[idAccount] AND [prd].[idProduto] = [mov].[idProduto])
  WHERE [mov].[idAccount] = @idAccount
    AND (@periodoInicio IS NULL OR CAST([mov].[dataHora] AS DATE) >= @periodoInicio)
    AND (@periodoFim IS NULL OR CAST([mov].[dataHora] AS DATE) <= @periodoFim)
    AND (@tipoMovimentacao IS NULL OR @tipoMovimentacao = 'todos' OR [mov].[tipoMovimentacao] = @tipoMovimentacao)
    AND (@idProduto IS NULL OR [mov].[idProduto] = @idProduto)
    AND (@idUsuario IS NULL OR [mov].[idUsuario] = @idUsuario)
  ORDER BY
    CASE WHEN @ordenacao = 'data_crescente' THEN [mov].[dataHora] END ASC,
    CASE WHEN @ordenacao = 'data_decrescente' THEN [mov].[dataHora] END DESC,
    CASE WHEN @ordenacao = 'produto' THEN [prd].[nome] END ASC,
    CASE WHEN @ordenacao = 'tipo' THEN [mov].[tipoMovimentacao] END ASC
  OFFSET @offset ROWS
  FETCH NEXT @itensPorPagina ROWS ONLY;

  /**
   * @output {TotalCount, 1, 1}
   * @column {INT} total - Total count of movements
   */
  SELECT COUNT(*) AS [total]
  FROM [functional].[movimentacao] [mov]
  WHERE [mov].[idAccount] = @idAccount
    AND (@periodoInicio IS NULL OR CAST([mov].[dataHora] AS DATE) >= @periodoInicio)
    AND (@periodoFim IS NULL OR CAST([mov].[dataHora] AS DATE) <= @periodoFim)
    AND (@tipoMovimentacao IS NULL OR @tipoMovimentacao = 'todos' OR [mov].[tipoMovimentacao] = @tipoMovimentacao)
    AND (@idProduto IS NULL OR [mov].[idProduto] = @idProduto)
    AND (@idUsuario IS NULL OR [mov].[idUsuario] = @idUsuario);
END;
GO

/**
 * @summary
 * Recalculates stock balance for a product
 *
 * @procedure spSaldoEstoqueRecalculate
 * @schema functional
 * @type stored-procedure
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idProduto - Product identifier
 *
 * @testScenarios
 * - Recalculate after entrada
 * - Recalculate after saida
 * - Recalculate after ajuste
 * - Status determination based on stock levels
 */
CREATE OR ALTER PROCEDURE [functional].[spSaldoEstoqueRecalculate]
  @idAccount INTEGER,
  @idProduto INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @quantidadeAtual NUMERIC(15, 2);
  DECLARE @valorMedio NUMERIC(18, 6);
  DECLARE @valorTotal NUMERIC(18, 6);
  DECLARE @ultimaMovimentacao DATETIME2;
  DECLARE @status VARCHAR(20);
  DECLARE @estoqueMinimo NUMERIC(15, 2);
  DECLARE @estoqueMaximo NUMERIC(15, 2);

  /**
   * @rule {fn-order-processing}
   * Calculate current quantity by summing all movements
   */
  SELECT @quantidadeAtual = ISNULL(SUM([mov].[quantidade]), 0)
  FROM [functional].[movimentacao] [mov]
  WHERE [mov].[idAccount] = @idAccount
    AND [mov].[idProduto] = @idProduto;

  /**
   * @rule {fn-order-processing}
   * Calculate weighted average cost from entries and positive adjustments
   */
  WITH [EntryMovements] AS (
    SELECT
      [mov].[quantidade],
      [mov].[custoUnitario]
    FROM [functional].[movimentacao] [mov]
    WHERE [mov].[idAccount] = @idAccount
      AND [mov].[idProduto] = @idProduto
      AND [mov].[tipoMovimentacao] IN ('entrada', 'criacao')
      AND [mov].[custoUnitario] IS NOT NULL
    UNION ALL
    SELECT
      [mov].[quantidade],
      [mov].[custoUnitario]
    FROM [functional].[movimentacao] [mov]
    WHERE [mov].[idAccount] = @idAccount
      AND [mov].[idProduto] = @idProduto
      AND [mov].[tipoMovimentacao] = 'ajuste'
      AND [mov].[quantidade] > 0
      AND [mov].[custoUnitario] IS NOT NULL
  )
  SELECT
    @valorMedio = CASE
      WHEN SUM([quantidade]) > 0 THEN SUM([quantidade] * [custoUnitario]) / SUM([quantidade])
      ELSE 0
    END
  FROM [EntryMovements];

  SET @valorMedio = ISNULL(@valorMedio, 0);
  SET @valorTotal = @quantidadeAtual * @valorMedio;

  /**
   * @rule {fn-order-processing}
   * Get last movement date
   */
  SELECT @ultimaMovimentacao = MAX([mov].[dataHora])
  FROM [functional].[movimentacao] [mov]
  WHERE [mov].[idAccount] = @idAccount
    AND [mov].[idProduto] = @idProduto;

  /**
   * @rule {fn-order-processing}
   * Get product stock limits
   */
  SELECT
    @estoqueMinimo = [prd].[estoqueMinimo],
    @estoqueMaximo = [prd].[estoqueMaximo]
  FROM [functional].[produto] [prd]
  WHERE [prd].[idAccount] = @idAccount
    AND [prd].[idProduto] = @idProduto;

  /**
   * @rule {fn-order-processing}
   * Determine stock status
   */
  IF (@quantidadeAtual = 0)
  BEGIN
    SET @status = 'zerado';
  END
  ELSE IF (@quantidadeAtual > @estoqueMaximo)
  BEGIN
    SET @status = 'excesso';
  END
  ELSE IF (@quantidadeAtual <= (@estoqueMinimo * 0.5))
  BEGIN
    SET @status = 'critico';
  END
  ELSE IF (@quantidadeAtual <= @estoqueMinimo)
  BEGIN
    SET @status = 'baixo';
  END
  ELSE
  BEGIN
    SET @status = 'normal';
  END;

  /**
   * @rule {fn-order-processing}
   * Update or insert stock balance
   */
  IF EXISTS (
    SELECT 1
    FROM [functional].[saldoEstoque] [sld]
    WHERE [sld].[idAccount] = @idAccount
      AND [sld].[idProduto] = @idProduto
  )
  BEGIN
    UPDATE [functional].[saldoEstoque]
    SET
      [quantidadeAtual] = @quantidadeAtual,
      [valorMedio] = @valorMedio,
      [valorTotal] = @valorTotal,
      [ultimaMovimentacao] = @ultimaMovimentacao,
      [status] = @status,
      [dateModified] = GETUTCDATE()
    WHERE [idAccount] = @idAccount
      AND [idProduto] = @idProduto;
  END
  ELSE
  BEGIN
    INSERT INTO [functional].[saldoEstoque] (
      [idAccount],
      [idProduto],
      [quantidadeAtual],
      [valorMedio],
      [valorTotal],
      [ultimaMovimentacao],
      [status],
      [dateModified]
    )
    VALUES (
      @idAccount,
      @idProduto,
      @quantidadeAtual,
      @valorMedio,
      @valorTotal,
      @ultimaMovimentacao,
      @status,
      GETUTCDATE()
    );
  END;
END;
GO

/**
 * @summary
 * Gets stock balance for a product
 *
 * @procedure spSaldoEstoqueGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/saldo-estoque/:idProduto
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idProduto - Product identifier
 *
 * @testScenarios
 * - Get balance for existing product
 * - Get balance for product without movements
 */
CREATE OR ALTER PROCEDURE [functional].[spSaldoEstoqueGet]
  @idAccount INTEGER,
  @idProduto INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idProduto IS NULL)
  BEGIN
    ;THROW 51000, 'idProdutoRequired', 1;
  END;

  /**
   * @validation Product existence validation
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[produto] [prd]
    WHERE [prd].[idProduto] = @idProduto
      AND [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  /**
   * @output {SaldoEstoque, 1, n}
   * @column {INT} idProduto - Product identifier
   * @column {NVARCHAR} nomeProduto - Product name
   * @column {NUMERIC} quantidadeAtual - Current quantity
   * @column {NUMERIC} valorMedio - Average unit cost
   * @column {NUMERIC} valorTotal - Total stock value
   * @column {DATETIME2} ultimaMovimentacao - Last movement date
   * @column {VARCHAR} status - Stock status
   * @column {NUMERIC} estoqueMinimo - Minimum stock level
   * @column {NUMERIC} estoqueMaximo - Maximum stock level
   */
  SELECT
    [prd].[idProduto],
    [prd].[nome] AS [nomeProduto],
    ISNULL([sld].[quantidadeAtual], 0) AS [quantidadeAtual],
    ISNULL([sld].[valorMedio], 0) AS [valorMedio],
    ISNULL([sld].[valorTotal], 0) AS [valorTotal],
    [sld].[ultimaMovimentacao],
    ISNULL([sld].[status], 'zerado') AS [status],
    [prd].[estoqueMinimo],
    [prd].[estoqueMaximo]
  FROM [functional].[produto] [prd]
    LEFT JOIN [functional].[saldoEstoque] [sld] ON ([sld].[idAccount] = [prd].[idAccount] AND [sld].[idProduto] = [prd].[idProduto])
  WHERE [prd].[idAccount] = @idAccount
    AND [prd].[idProduto] = @idProduto
    AND [prd].[deleted] = 0;
END;
GO

/**
 * @summary
 * Gets movement history for a product with optional accumulated balance
 *
 * @procedure spMovimentacaoHistoricoGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/movimentacao/historico/:idProduto
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idProduto - Product identifier
 * @param {DATE} periodoInicio - Start date filter
 * @param {DATE} periodoFim - End date filter
 * @param {VARCHAR} tipoMovimentacao - Movement type filter
 * @param {BIT} exibirSaldoAcumulado - Show accumulated balance flag
 *
 * @testScenarios
 * - Get history without filters
 * - Get history with date range
 * - Get history with accumulated balance
 * - Get history filtered by movement type
 */
CREATE OR ALTER PROCEDURE [functional].[spMovimentacaoHistoricoGet]
  @idAccount INTEGER,
  @idProduto INTEGER,
  @periodoInicio DATE = NULL,
  @periodoFim DATE = NULL,
  @tipoMovimentacao VARCHAR(20) = 'todos',
  @exibirSaldoAcumulado BIT = 1
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idProduto IS NULL)
  BEGIN
    ;THROW 51000, 'idProdutoRequired', 1;
  END;

  /**
   * @validation Product existence validation
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[produto] [prd]
    WHERE [prd].[idProduto] = @idProduto
      AND [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  IF (@periodoFim IS NOT NULL AND @periodoInicio IS NOT NULL AND @periodoFim < @periodoInicio)
  BEGIN
    ;THROW 51000, 'periodoFimMustBeGreaterThanInicio', 1;
  END;

  /**
   * @output {MovimentacaoHistorico, n, n}
   * @column {INT} idMovimentacao - Movement identifier
   * @column {VARCHAR} tipoMovimentacao - Movement type
   * @column {NUMERIC} quantidade - Quantity moved
   * @column {DATETIME2} dataHora - Movement date and time
   * @column {INT} idUsuario - User identifier
   * @column {NVARCHAR} motivo - Movement reason
   * @column {NVARCHAR} observacao - Additional observations
   * @column {VARCHAR} numeroNotaFiscal - Invoice number
   * @column {NUMERIC} custoUnitario - Unit cost
   * @column {NVARCHAR} lote - Batch number
   * @column {DATE} dataValidade - Expiration date
   * @column {NUMERIC} saldoAcumulado - Accumulated balance (if requested)
   */
  IF (@exibirSaldoAcumulado = 1)
  BEGIN
    WITH [MovementHistory] AS (
      SELECT
        [mov].[idMovimentacao],
        [mov].[tipoMovimentacao],
        [mov].[quantidade],
        [mov].[dataHora],
        [mov].[idUsuario],
        [mov].[motivo],
        [mov].[observacao],
        [mov].[numeroNotaFiscal],
        [mov].[custoUnitario],
        [mov].[lote],
        [mov].[dataValidade],
        SUM([mov].[quantidade]) OVER (ORDER BY [mov].[dataHora], [mov].[idMovimentacao]) AS [saldoAcumulado]
      FROM [functional].[movimentacao] [mov]
      WHERE [mov].[idAccount] = @idAccount
        AND [mov].[idProduto] = @idProduto
        AND (@periodoInicio IS NULL OR CAST([mov].[dataHora] AS DATE) >= @periodoInicio)
        AND (@periodoFim IS NULL OR CAST([mov].[dataHora] AS DATE) <= @periodoFim)
        AND (@tipoMovimentacao = 'todos' OR [mov].[tipoMovimentacao] = @tipoMovimentacao)
    )
    SELECT
      [idMovimentacao],
      [tipoMovimentacao],
      [quantidade],
      [dataHora],
      [idUsuario],
      [motivo],
      [observacao],
      [numeroNotaFiscal],
      [custoUnitario],
      [lote],
      [dataValidade],
      [saldoAcumulado]
    FROM [MovementHistory]
    ORDER BY [dataHora], [idMovimentacao];
  END
  ELSE
  BEGIN
    SELECT
      [mov].[idMovimentacao],
      [mov].[tipoMovimentacao],
      [mov].[quantidade],
      [mov].[dataHora],
      [mov].[idUsuario],
      [mov].[motivo],
      [mov].[observacao],
      [mov].[numeroNotaFiscal],
      [mov].[custoUnitario],
      [mov].[lote],
      [mov].[dataValidade]
    FROM [functional].[movimentacao] [mov]
    WHERE [mov].[idAccount] = @idAccount
      AND [mov].[idProduto] = @idProduto
      AND (@periodoInicio IS NULL OR CAST([mov].[dataHora] AS DATE) >= @periodoInicio)
      AND (@periodoFim IS NULL OR CAST([mov].[dataHora] AS DATE) <= @periodoFim)
      AND (@tipoMovimentacao = 'todos' OR [mov].[tipoMovimentacao] = @tipoMovimentacao)
    ORDER BY [mov].[dataHora], [mov].[idMovimentacao];
  END;
END;
GO


-- ============================================
-- Migration completed successfully
-- ============================================

PRINT 'Migration completed successfully!';
GO
